import { mrt, output, velocity, screenUV } from "three/tsl";
import { usePostProcessing } from "@react-three/fiber/webgpu";
import { bloom } from "three/examples/jsm/tsl/display/BloomNode.js";

export const PostProcessing = () => {
  usePostProcessing(
    ({ postProcessing, passes }) => {
      const beauty = passes.scenePass.getTextureNode();

      const bloomPass = bloom(beauty, 0.25, 0, 0);
      const mBlur = beauty.add(bloomPass);

      const vignette = screenUV
        .distance(0.5)
        .remap(0.6, 1)
        .mul(2)
        .clamp()
        .oneMinus();

      postProcessing.outputNode = mBlur.mul(vignette);

      return { beauty, motionBlur: mBlur };
    },
    ({ passes }) => {
      passes.scenePass.setMRT(
        mrt({
          output,
          velocity,
        }),
      );
    },
  );

  return null;
};
