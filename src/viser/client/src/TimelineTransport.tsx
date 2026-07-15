// Playback transport for the timeline, sitting in the top-left header cell (on
// the frame-number line, above the track labels). Play advances the playhead at
// the timeline fps by pushing frame changes through the existing onFrameChange
// path; looping back to the start at the end.
import { useEffect, useRef, useState } from "react";
import { ActionIcon, Tooltip } from "@mantine/core";
import {
  IconPlayerPauseFilled,
  IconPlayerPlayFilled,
  IconPlayerSkipBackFilled,
  IconPlayerSkipForwardFilled,
  IconPlayerTrackNextFilled,
  IconPlayerTrackPrevFilled,
} from "@tabler/icons-react";
import { TRACK_LABEL_WIDTH } from "./timeline/constants";
import { FRAME_LABELS_HEIGHT } from "./TimelineConstants";

export function TimelineTransport({
  fps,
  startFrame,
  endFrame,
  currentFrame,
  onFrameChange,
}: {
  fps: number;
  startFrame: number;
  endFrame: number;
  currentFrame: number;
  onFrameChange: (frame: number) => void;
}) {
  const [playing, setPlaying] = useState(false);

  // Refs so the interval always reads the latest frame/range/callback without
  // re-arming. onFrameChange gets a new identity every frame (its parent closes
  // over the timeline state it optimistically advances), so it must NOT sit in the
  // effect deps — otherwise the interval is torn down and recreated on every frame
  // and playback never progresses past the first tick.
  const frameRef = useRef(currentFrame);
  frameRef.current = currentFrame;
  const rangeRef = useRef({ startFrame, endFrame });
  rangeRef.current = { startFrame, endFrame };
  const onFrameChangeRef = useRef(onFrameChange);
  onFrameChangeRef.current = onFrameChange;

  useEffect(() => {
    if (!playing) return;
    const period = Math.max(16, 1000 / (fps || 30));
    const id = window.setInterval(() => {
      const { startFrame: s, endFrame: e } = rangeRef.current;
      let next = frameRef.current + 1;
      if (next > e) next = s; // loop
      frameRef.current = next;
      onFrameChangeRef.current(next);
    }, period);
    return () => window.clearInterval(id);
  }, [playing, fps]);

  // Stop playing if the clip has no length.
  useEffect(() => {
    if (endFrame <= startFrame) setPlaying(false);
  }, [endFrame, startFrame]);

  const clamp = (f: number) => Math.max(startFrame, Math.min(endFrame, f));
  const btn = (
    label: string,
    icon: React.ReactNode,
    onClick: () => void,
  ) => (
    <Tooltip label={label} withArrow openDelay={400} zIndex={100}>
      <ActionIcon size="sm" variant="subtle" color="gray" onClick={onClick}>
        {icon}
      </ActionIcon>
    </Tooltip>
  );

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: `${TRACK_LABEL_WIDTH}px`,
        height: `${FRAME_LABELS_HEIGHT}px`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "1px",
        zIndex: 6,
      }}
    >
      {btn("Jump to start", <IconPlayerSkipBackFilled size="0.85em" />, () =>
        onFrameChange(startFrame),
      )}
      {btn("Step back", <IconPlayerTrackPrevFilled size="0.85em" />, () =>
        onFrameChange(clamp(currentFrame - 1)),
      )}
      {btn(
        playing ? "Pause" : "Play",
        playing ? (
          <IconPlayerPauseFilled size="1em" />
        ) : (
          <IconPlayerPlayFilled size="1em" />
        ),
        () => setPlaying((p) => !p),
      )}
      {btn("Step forward", <IconPlayerTrackNextFilled size="0.85em" />, () =>
        onFrameChange(clamp(currentFrame + 1)),
      )}
      {btn("Jump to end", <IconPlayerSkipForwardFilled size="0.85em" />, () =>
        onFrameChange(endFrame),
      )}
    </div>
  );
}
