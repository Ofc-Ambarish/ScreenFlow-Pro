let mediaRecorder;
let recordedChunks = [];
let isPaused = false;

document.getElementById("start").addEventListener("click", async () => {
  const resolution = document.getElementById("resolution").value;
  const quality = document.getElementById("quality").value;

  const stream = await startScreenCapture(resolution);
  if (stream) {
    startRecording(stream, quality);
    document.getElementById("start").disabled = true;
    document.getElementById("pause").disabled = false;
    document.getElementById("stop").disabled = false;
  }
});

document.getElementById("pause").addEventListener("click", () => {
  if (mediaRecorder.state === "recording") {
    mediaRecorder.pause();
    isPaused = true;
    document.getElementById("pause").disabled = true;
    document.getElementById("resume").disabled = false;
  }
});

document.getElementById("resume").addEventListener("click", () => {
  if (mediaRecorder.state === "paused") {
    mediaRecorder.resume();
    isPaused = false;
    document.getElementById("resume").disabled = true;
    document.getElementById("pause").disabled = false;
  }
});

document.getElementById("stop").addEventListener("click", () => {
  stopRecording();
  document.getElementById("start").disabled = false;
  document.getElementById("pause").disabled = true;
  document.getElementById("resume").disabled = true;
  document.getElementById("stop").disabled = true;
});

async function startScreenCapture(resolution) {
  const micAudio = document.getElementById("mic-audio").checked;
  const sysAudio = document.getElementById("sys-audio").checked;

  const audioConstraints = [];
  if (micAudio) audioConstraints.push("microphone");
  if (sysAudio) audioConstraints.push("system");

  const options = {
    video: { cursor: "always" },
    audio: sysAudio || micAudio,
  };

  if (resolution !== "default") {
    const [width, height] = resolution.split("x").map(Number);
    options.video.width = width;
    options.video.height = height;
  }

  try {
    const stream = await navigator.mediaDevices.getDisplayMedia(options);
    return stream;
  } catch (error) {
    console.error("Error capturing screen:", error);
    return null;
  }
}

function startRecording(stream, quality) {
  const mimeType = "video/mp4";
  const bitsPerSecond =
    quality === "high" ? 5000000 : quality === "medium" ? 2500000 : 1000000;

  mediaRecorder = new MediaRecorder(stream, { mimeType, bitsPerSecond });
  recordedChunks = [];

  mediaRecorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
      recordedChunks.push(event.data);
    }
  };

  mediaRecorder.onstop = () => {
    const blob = new Blob(recordedChunks, { type: mimeType });
    const fileName = "recording.mp4";

    const url = URL.createObjectURL(blob);
    const downloadLink = document.getElementById("downloadLink");
    downloadLink.href = url;
    downloadLink.download = fileName;

    setTimeout(() => {
      downloadLink.click();  // Trigger download after a slight delay
    }, 200);  // Adjust the delay time if necessary (in milliseconds)
  };

  mediaRecorder.start();
}

function stopRecording() {
  mediaRecorder.stop();
  const tracks = mediaRecorder.stream.getTracks();
  tracks.forEach((track) => track.stop());
}

// Contact Support
document.getElementById("contactSupport").addEventListener("click", () => {
  const subject = encodeURIComponent("Support Request: ScreenFlow Pro V3.1");
  const body = encodeURIComponent(
    "Hello,\n\nI need assistance with the ScreenFlow Pro extension. Please provide guidance.\n\nDetails:\n[Include any relevant details]"
  );
  const mailto = `mailto:dev.ambarish.ofc@gmail.com?subject=${subject}&body=${body}`;
  window.open(mailto, "_blank");
});

// Report Bug
document.getElementById("reportBug").addEventListener("click", () => {
  const subject = encodeURIComponent("Bug Report: ScreenFlow Pro V3.1");
  const body = encodeURIComponent(
    "Hello,\n\nI encountered the following issue while using the ScreenFlow Pro extension:\n\n[Describe the issue]\n\nSteps to Reproduce:\n1.\n2.\n3.\n\nExpected Outcome:\n\nActual Outcome:\n\nExtension Version: 3.1\nBrowser Version: [Include browser version]\n\nThank you!"
  );
  const mailto = `mailto:dev.ambarish.ofc@gmail.com?subject=${subject}&body=${body}`;
  window.open(mailto, "_blank");
});

// Initialize Annotations
function initializeAnnotations() {
  const canvas = document.createElement("canvas");
  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100vw";
  canvas.style.height = "100vh";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "9999";

  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let drawing = false;

  canvas.addEventListener("mousedown", (e) => {
    drawing = true;
    ctx.moveTo(e.clientX, e.clientY);
  });

  canvas.addEventListener("mousemove", (e) => {
    if (drawing) {
      ctx.lineTo(e.clientX, e.clientY);
      ctx.strokeStyle = "red";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  });

  canvas.addEventListener("mouseup", () => {
    drawing = false;
  });
}
