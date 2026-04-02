figma.showUI(__html__, { width: 360, height: 540, title: "Scope Guard" });

interface Settings {
  frameThreshold: number;
  instanceThreshold: number;
}

const DEFAULT_SETTINGS: Settings = { frameThreshold: 2, instanceThreshold: 5 };

let settings: Settings = { ...DEFAULT_SETTINGS };
let sessionMode: "hotfix" | "version-update" = "hotfix";
const changedFrames = new Map<string, string>(); // nodeId -> frameName
const changedInstances = new Map<string, string>(); // nodeId -> instanceName
let frameThresholdTriggered = false;
let instanceThresholdTriggered = false;

async function init(): Promise<void> {
  const saved = (await figma.clientStorage.getAsync(
    "settings",
  )) as Partial<Settings> | null;
  if (
    saved &&
    typeof saved.frameThreshold === "number" &&
    typeof saved.instanceThreshold === "number"
  ) {
    settings = {
      frameThreshold: saved.frameThreshold,
      instanceThreshold: saved.instanceThreshold,
    };
  }
  figma.ui.postMessage({
    type: "settings-loaded",
    frameThreshold: settings.frameThreshold,
    instanceThreshold: settings.instanceThreshold,
  });

  // dynamic-page 모드에서 documentchange 등록 전 필수 호출
  await figma.loadAllPagesAsync();

  registerDocumentChangeHandler();
  sendSessionUpdate();
}

function sendSessionUpdate(): void {
  figma.ui.postMessage({
    type: "session-update",
    mode: sessionMode,
    changedFrames: Array.from(changedFrames.entries()).map(([id, name]) => ({
      id,
      name,
    })),
    changedInstances: Array.from(changedInstances.entries()).map(
      ([id, name]) => ({ id, name }),
    ),
    frameCount: changedFrames.size,
    instanceCount: changedInstances.size,
    frameThreshold: settings.frameThreshold,
    instanceThreshold: settings.instanceThreshold,
  });
}

function getTopLevelFrame(node: BaseNode): FrameNode | null {
  let current: BaseNode | null = node;
  while (
    current !== null &&
    current.parent !== null &&
    current.parent.type !== "PAGE"
  ) {
    current = current.parent;
  }
  if (
    current !== null &&
    current.type === "FRAME" &&
    current.parent !== null &&
    current.parent.type === "PAGE"
  ) {
    return current as FrameNode;
  }
  return null;
}

function getNearestInstance(node: BaseNode): InstanceNode | null {
  let current: BaseNode | null = node;
  while (current !== null) {
    if (current.type === "PAGE" || current.type === "DOCUMENT") return null;
    if (current.type === "INSTANCE") return current as InstanceNode;
    current = current.parent;
  }
  return null;
}

function registerDocumentChangeHandler(): void {
  figma.on("documentchange", ({ documentChanges }) => {
    let changed = false;

    for (const change of documentChanges) {
      if (
        change.type === "STYLE_CREATE" ||
        change.type === "STYLE_DELETE" ||
        change.type === "STYLE_PROPERTY_CHANGE"
      )
        continue;

      const rawNode = change.node;

      // RemovedNode는 parent/name이 없으므로 건너뜀
      if ("removed" in rawNode && rawNode.removed) continue;

      const node = rawNode as SceneNode;

      // [확정] 페이지 이름 변경 감지 (런타임에 PAGE 노드가 올 수 있음)
      const nodeAny = rawNode as unknown as Record<string, unknown>;
      if (nodeAny["type"] === "PAGE" && change.type === "PROPERTY_CHANGE") {
        const props = change.properties as ReadonlyArray<string>;
        if (
          props.some((p) => p === "name") &&
          typeof nodeAny["name"] === "string"
        ) {
          const pageName = nodeAny["name"] as string;
          if (pageName.includes("확정")) {
            figma.ui.postMessage({
              type: "page-promoted",
              pageName,
              pageId: rawNode.id,
            });
          }
        }
        continue;
      }

      // 최상위 프레임 변경 추적
      try {
        const frame = getTopLevelFrame(node);
        if (frame !== null && !changedFrames.has(frame.id)) {
          changedFrames.set(frame.id, frame.name);
          changed = true;
        }
      } catch (_) {
        /* 삭제된 노드 등 접근 불가 케이스 무시 */
      }

      // 컴포넌트 인스턴스 변경 추적
      try {
        const instance = getNearestInstance(node);
        if (instance !== null && !changedInstances.has(instance.id)) {
          changedInstances.set(instance.id, instance.name);
          changed = true;
        }
      } catch (_) {
        /* 삭제된 노드 등 접근 불가 케이스 무시 */
      }
    }

    if (changed) {
      sendSessionUpdate();

      if (
        !frameThresholdTriggered &&
        changedFrames.size > settings.frameThreshold
      ) {
        frameThresholdTriggered = true;
        figma.ui.postMessage({
          type: "threshold-exceeded",
          exceedType: "frame",
          count: changedFrames.size,
          threshold: settings.frameThreshold,
        });
      }

      if (
        !instanceThresholdTriggered &&
        changedInstances.size > settings.instanceThreshold
      ) {
        instanceThresholdTriggered = true;
        figma.ui.postMessage({
          type: "threshold-exceeded",
          exceedType: "instance",
          count: changedInstances.size,
          threshold: settings.instanceThreshold,
        });
      }
    }
  });
}

function handleMessage(msg: { type: string; [key: string]: unknown }): void {
  const run = async (): Promise<void> => {
    switch (msg.type) {
      case "set-mode":
        sessionMode = msg.mode as "hotfix" | "version-update";
        frameThresholdTriggered = false;
        instanceThresholdTriggered = false;
        sendSessionUpdate();
        break;

      case "reset-session":
        changedFrames.clear();
        changedInstances.clear();
        frameThresholdTriggered = false;
        instanceThresholdTriggered = false;
        sendSessionUpdate();
        break;

      case "save-settings": {
        const ft = Number(msg.frameThreshold);
        const it = Number(msg.instanceThreshold);
        settings = {
          frameThreshold:
            Number.isFinite(ft) && ft >= 1
              ? Math.floor(ft)
              : DEFAULT_SETTINGS.frameThreshold,
          instanceThreshold:
            Number.isFinite(it) && it >= 1
              ? Math.floor(it)
              : DEFAULT_SETTINGS.instanceThreshold,
        };
        await figma.clientStorage.setAsync("settings", settings);
        figma.ui.postMessage({
          type: "settings-saved",
          frameThreshold: settings.frameThreshold,
          instanceThreshold: settings.instanceThreshold,
        });
        break;
      }

      case "close":
        figma.closePlugin();
        break;
    }
  };
  void run();
}

figma.ui.onmessage = handleMessage;
void init();
