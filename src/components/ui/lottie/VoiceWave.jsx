import { flatten } from "lottie-colorify";
import Lottie from "lottie-react";
import React from "react";
import voiceWave from "../../../assets/animation/voice.json";

function VoiceWave() {
  const coloredAnimationData = flatten("#ffffff", voiceWave);
  return <Lottie animationData={coloredAnimationData} />;
}
export default React.memo(VoiceWave);
