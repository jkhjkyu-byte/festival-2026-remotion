import { durationInFrames } from "./data/cinematic-timeline";
import {
  AwardProof,
  CinematicMaster,
  OpeningProof,
  PlateReel,
  plateFrames,
  plateProfiles,
} from "./scenes/CinematicMaster";
import { Composition, Folder } from "remotion";
import { festivalProductionFormat, getSceneTiming } from "./data/production";
import { festivalFormat } from "./data/festival";
import { FestivalProduction } from "./scenes/FestivalProduction";
import { FestivalSmoke } from "./scenes/FestivalSmoke";
import { FestivalWebGL } from "./three/FestivalWebGL";

export const RemotionRoot = () => (
  <>
    <Composition
      id="FestivalCinematic"
      component={CinematicMaster}
      {...festivalProductionFormat}
      durationInFrames={durationInFrames}
    />
    <Folder name="CinematicProofs">
      <Composition
        id="CinematicOpeningProof"
        component={OpeningProof}
        {...festivalProductionFormat}
        durationInFrames={150}
      />
      <Composition
        id="CinematicAwardProof"
        component={AwardProof}
        {...festivalProductionFormat}
        durationInFrames={150}
      />
      <Composition
        id="CinematicStagePlates"
        component={PlateReel}
        width={1056}
        height={288}
        fps={30}
        durationInFrames={plateFrames * plateProfiles.length}
      />
    </Folder>
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
