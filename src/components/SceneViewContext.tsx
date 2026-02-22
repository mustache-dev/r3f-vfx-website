import { create } from "zustand";

export type FeatureSceneId = "emitterShapes" | "physics" | "attractors" | "customShaders";

type SceneViewStore = {
  /** Which feature scene is currently most visible (null if none) */
  activeFeature: FeatureSceneId | null;
  setActiveFeature: (id: FeatureSceneId | null) => void;
  /** Registered DOM elements for each feature slot */
  elements: Map<FeatureSceneId, HTMLElement>;
  register: (id: FeatureSceneId, el: HTMLElement) => void;
  unregister: (id: FeatureSceneId) => void;
};

export const useSceneViewStore = create<SceneViewStore>((set, get) => ({
  activeFeature: null,
  setActiveFeature: (id) => set({ activeFeature: id }),
  elements: new Map(),
  register: (id, el) => {
    const elements = new Map(get().elements);
    elements.set(id, el);
    set({ elements });
  },
  unregister: (id) => {
    const elements = new Map(get().elements);
    elements.delete(id);
    set({ elements });
  },
}));
