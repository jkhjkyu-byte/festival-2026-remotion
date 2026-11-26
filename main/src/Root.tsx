import { Composition, Folder } from "remotion";
import { festivalProductionFormat, getSceneTiming } from "./data/production";
import { festivalFormat } from "./data/festival";
import { FestivalProduction } from "./scenes/FestivalProduction";
import { FestivalSmoke } from "./scenes/FestivalSmoke";
import { FestivalWebGL } from "./three/FestivalWebGL";

export const RemotionRoot = () => (
  <>
    <Composition
      id="FestivalMaster"
      component={FestivalProduction}
      {...festivalProductionFormat}
      durationInFrames={getSceneTiming().reduce(
        (total, cue) => total + cue.durationInFrames,
        0,
      )}
    />
    <Folder name="Diagnostics">
      <Composition
        id="FestivalSmoke"
        component={FestivalSmoke}
        {...festivalFormat}
      />
      <Composition
        id="FestivalWebGL"
        component={FestivalWebGL}
        width={640}
        height={360}
        fps={30}
        durationInFrames={30}
      />
    </Folder>
  </>
);
