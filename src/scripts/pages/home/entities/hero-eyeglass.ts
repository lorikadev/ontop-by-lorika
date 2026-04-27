import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { createCover3DObject } from "../3d-objects/cover/cover";
import { createEyeglass3DObject } from "../3d-objects/eye-glass";
import { Group, Object3D } from "three";
import { createIntroTimeline } from "../timelines/intro";
import { createUpdateTimeline } from "../timelines/update";
import { TimelineHandler } from "../../../../classes/timeline-handler";

export interface IEyeglass3DEntity {
    groupRef: Group,
    directRefs: {
        cover: Object3D,
        eyeglass: Object3D,
    }
    timelines: {
        intro: TimelineHandler,
        update: TimelineHandler,
    }
}

export async function createHeroEyeglassEntity(): Promise<IEyeglass3DEntity> {
    const gltfLoader = new GLTFLoader();

    //LOAD OBJECTS
    const coverObjRef = await createCover3DObject(gltfLoader);
    const eyeglassObjRef = await createEyeglass3DObject(gltfLoader);

    //CREATE GROUP AND SET TRANSFORM
    const group = new Group();
    group.add(coverObjRef, eyeglassObjRef);
    group.rotateX(Math.PI * 0.15); //-29 deg
    group.position.set(0, -3, 0);

    //CREATE TIMELINES
    const tlIntro = createIntroTimeline(group);
    const tlUpdate = createUpdateTimeline(coverObjRef);

    return {
        groupRef: group,
        directRefs: {
            cover: coverObjRef,
            eyeglass: eyeglassObjRef
        },
        timelines: {
            intro: new TimelineHandler(tlIntro),
            update: new TimelineHandler(tlUpdate)
        }
    }
}