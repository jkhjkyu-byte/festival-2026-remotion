import { Composition, Folder } from "remotion";
import { festivalFormat } from "./data/festival";
import { FestivalSmoke } from "./scenes/FestivalSmoke";
import { FestivalWebGL } from "./three/FestivalWebGL";

export const RemotionRoot = () => (
  <>
    <Composition id="FestivalSmoke" component={FestivalSmoke} {...festivalFormat} />
    <Folder name="Diagnostics">
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
