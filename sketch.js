// 소문자 (아두이노와 동일하게 입력)
const SERVICE_UUID = "19b10000-e8f2-537e-4f6c-d104768a1214"; 
const WRITE_UUID = "19b10001-e8f2-537e-4f6c-d104768a1214"; 
let writeChar, statusP, connectBtn, sendBtn1, sendBtn2, sendBtn3;
let circleColor; // 원의 색상 저장

function setup() {
  createCanvas(windowWidth, windowHeight);

  // 초기 색상 설정 (기본값: 검정)
  circleColor = color(0);

  // BLE 연결
  connectBtn = createButton("Scan & Connect");
  connectBtn.mousePressed(connectAny);
  connectBtn.size(120, 30);
  connectBtn.position(20, 40);

  statusP = createP("Status: Not connected");
  statusP.position(22, 60);

  // Send 버튼들 추가
  sendBtn1 = createButton("send 1");
  sendBtn1.mousePressed(() => {
    circleColor = color(255, 0, 0); // Red
    sendNumber(1);
  });
  sendBtn1.size(100, 30);
  sendBtn1.position(20, 100);

  sendBtn2 = createButton("send 2");
  sendBtn2.mousePressed(() => {
    circleColor = color(0, 255, 0); // Green
    sendNumber(2);
  });
  sendBtn2.size(100, 30);
  sendBtn2.position(20, 140);

  sendBtn3 = createButton("send 3");
  sendBtn3.mousePressed(() => {
    circleColor = color(0, 0, 255); // Blue
    sendNumber(3);
  });
  sendBtn3.size(100, 30);
  sendBtn3.position(20, 180);
}

function draw() {
  background(240); // 배경색 설정
  
  // 중앙에 크기 200인 원 그리기
  fill(circleColor);
  noStroke();
  ellipse(width / 2, height / 2, 200, 200);
}

// ---- BLE Connect ----
async function connectAny() {
  try {
    const device = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: [SERVICE_UUID],
    });
    const server = await device.gatt.connect();
    const service = await server.getPrimaryService(SERVICE_UUID);
    writeChar = await service.getCharacteristic(WRITE_UUID);
    statusP.html("Status: Connected to " + (device.name || "device"));
  } catch (e) {
    statusP.html("Status: Error - " + e);
    console.error(e);
  }
}

// ---- Write 1 byte to BLE ----
async function sendNumber(n) {
  if (!writeChar) {
    statusP.html("Status: Not connected");
    return;
  }
  try {
    await writeChar.writeValue(new Uint8Array([n & 0xff]));
    statusP.html("Status: Sent " + n);
  } catch (e) {
    statusP.html("Status: Write error - " + e);
  }
}
