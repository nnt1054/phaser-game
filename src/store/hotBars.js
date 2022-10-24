import { createSlice } from '@reduxjs/toolkit';

const hotBarsSlice = createSlice({
  name: 'hotBars',
  initialState: {
    1: {
        left: 50,
        bottom: 8,
        slots: [
            'frameIndex0',
            'frameIndex1',
            'frameIndex2',
            'frameIndex3',
            'frameIndex4',
            'frameIndex5',
            'frameIndex6',
            'frameIndex7',
            'frameIndex8',
            'frameIndex9',
            'frameIndex10',
            'frameIndex11',
            'resume',
            'pause',
            'copy_anim_to_clipboard',
            'decrementTranslateX',
            'decrementTranslateY',
            'incrementTranslateX',
            'decrementFrameKey',
        ]
    },
    2: {
        left: 50,
        bottom: 13,
        slots: [
            'composite_hair_back',
            'composite_legs',
            'composite_arm_back',
            'composite_armor_body_back_sleeve',
            'composite_torso',
            'composite_armor_body',
            'composite_arm_front',
            'composite_armor_body_front_sleeve',
            'composite_armor_body_collar',
            'composite_head',
            'composite_ears',
            'composite_face',
            'composite_hair_front',
            'select_all_composite_state',
            'unselect_all_composite_state',
            'decrementRotate',
            'incrementTranslateY',
            'incrementRotate',
            'incrementFrameKey',
        ]
    },
    3: {
        left: 96,
        bottom: 5,
        slots: [
            'frameIndex00',
            'frameIndex01',
            'frameIndex02',
            'empty',
            'empty',
            'empty',
            'empty',
            'empty',
            'resume',
            'pause',
        ]
    },
    4: {
        left: 92,
        bottom: 5,
        slots: [
            'empty',
            'empty',
            'empty',
            'empty',
            'empty',
            'empty',
            'empty',
            'empty',
            'empty',
            'empty',
        ]
    },
  },
  reducers: {
    doNothing: (state) => {},
  }
})

export const {
    doNothing,
} = hotBarsSlice.actions;

export default hotBarsSlice;
