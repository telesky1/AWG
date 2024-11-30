// 计算AWG相关的值
function calculateAWG(awg) {
  let inch = 0.005 * Math.pow(92, (36 - awg) / 39);
  let diameter = 0.127 * Math.pow(92, (36 - awg) / 39);
  let inchArea = Math.PI / 4 * Math.pow(inch, 2);
  let area = Math.PI / 4 * Math.pow(diameter, 2);
  let milArea = 1000 * Math.pow(inch, 2);

  return {
    awg: awg,
    diameter: diameter,
    area: area,
    inchDiameter: inch,
    inchArea: inchArea,
    milArea: milArea
  };
}

// 更新值并恢复为显示模式
function updateValue(event, field) {
  const errorMsg = document.getElementById("errorAWG");
  const box = document.getElementById(field + "Box");

  // 防止按回车时换行
  if (event.key === "Enter") {
    event.preventDefault(); // 阻止换行

    let value = parseFloat(box.textContent.trim());

    if (isNaN(value)) {
      // 清空其他框
      clearAllFields();
      return; // 如果输入为空，清空所有输入框
    }

    let closestAWG;

    // 根据输入类型找到最接近的AWG
    if (field === "awg") {
      if (value < 0 || value > 40) {
        showError("值超出范围 [0-40]");
        return; // 如果超出范围，停止进一步操作
      }
    }

    if (field === 'diameter') {
      closestAWG = findClosestAWGByDiameter(value);
    } else if (field === 'area') {
      closestAWG = findClosestAWGByArea(value);
    } else if (field === 'inchDiameter') {
      let diameterInMm = value * 25.4; // 转换为毫米
      closestAWG = findClosestAWGByDiameter(diameterInMm);
    } else if (field === 'inchArea') {
      let areaInMm2 = value * 645.16; // 转换为平方毫米
      closestAWG = findClosestAWGByArea(areaInMm2);
    } else {
      closestAWG = value;
    }


    // 计算出AWG值后，检查它是否在有效范围内
    if (closestAWG < 0 || closestAWG > 40) {
      return; // 不再继续处理
    }

    // 清除错误提示（在输入有效时清除）
    clearError();

    let result = calculateAWG(closestAWG);
    // 更新所有显示框，并加上单位
    document.getElementById("awgBox").textContent = `${result.awg.toFixed(0)} (AWG)`;
    document.getElementById("diameterBox").textContent = `${result.diameter.toFixed(4)} (mm φ)`;
    document.getElementById("inchDiameterBox").textContent = `${result.inchDiameter.toFixed(4)} (in φ)`;
    document.getElementById("areaBox").textContent = `${result.area.toFixed(4)} (mm²)`;
    document.getElementById("inchAreaBox").textContent = `${result.inchArea.toFixed(5)} (in²)`;
    document.getElementById("milAreaBox").textContent = `${result.milArea.toFixed(4)} (KCMIL)`;

    // 手动去除焦点
    document.activeElement.blur(); // 移除当前输入框的焦点
  }
}


// 清除错误提示
function clearError() {
  const errorMsg = document.getElementById("errorAWG");
  errorMsg.style.display = "none"; // 隐藏错误信息
  const box = document.getElementById("awgBox");
  box.style.borderColor = "#ccc"; // 恢复边框颜色
  box.classList.remove("shake-border"); // 移除闪烁效果
}

// 显示错误提示
function showError(message) {
  const errorMsg = document.getElementById("errorAWG");
  const box = document.getElementById("awgBox");
  errorMsg.textContent = message;
  errorMsg.style.display = "block"; // 显示错误信息
  box.style.borderColor = "red"; // 设置边框颜色为红色
  box.classList.add("shake-border"); // 添加闪烁效果
}


// 清空所有输入框并恢复显示提示文本
function clearAllFields() {
  const fields = ["awg", "diameter", "inchDiameter", "area", "inchArea", "milArea"];
  fields.forEach(field => {
    const box = document.getElementById(field + "Box");
    box.textContent = ""; // 清空文本内容
  });

  // 重新聚焦到原来的输入框
  document.activeElement.focus();
}


// 根据输入的直径（mm）找到最接近的AWG
function findClosestAWGByDiameter(diameter) {
  let closestAWG = -1;
  let closestDiff = Infinity;

  for (let awg = 0; awg <= 40; awg++) {
    let calc = calculateAWG(awg);
    let diff = Math.abs(calc.diameter - diameter);
    if (diff < closestDiff) {
      closestDiff = diff;
      closestAWG = awg;
    }
  }

  return closestAWG;
}

// 根据输入的面积（mm²）找到最接近的AWG
function findClosestAWGByArea(area) {
  let closestAWG = -1;
  let closestDiff = Infinity;

  for (let awg = 0; awg <= 40; awg++) {
    let calc = calculateAWG(awg);
    let diff = Math.abs(calc.area - area);
    if (diff < closestDiff) {
      closestDiff = diff;
      closestAWG = awg;
    }
  }

  return closestAWG;
}

// 当点击输入框时清空其中的内容
function editField(field) {
  const box = document.getElementById(field + "Box");

  // 清空内容
  box.textContent = "";
  box.focus();  // 确保输入框获得焦点
}

// 显示弹窗
document.getElementById("showInfoButton").addEventListener("click", function () {
  document.getElementById("infoModal").style.display = "block";
});

// 关闭弹窗
function closeModal() {
  document.getElementById("infoModal").style.display = "none";
}

// 点击弹窗外部时关闭弹窗
window.addEventListener('click', function (event) {
  const modal = document.getElementById("infoModal");
  if (event.target === modal) {
    closeModal();
  }
});

// 隐藏加载提示
function hideLoadingMessage() {
  const loadingMessage = document.getElementById("loadingMessage");
  loadingMessage.style.display = "none"; // 隐藏加载提示
}
