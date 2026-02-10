/**
 * @author    : izzetseydaoglu
 * @copyright : sydSOFT Bilişim Hizmetleri (c) 2026
 * @version   : 2026-02-10 20:23:07
 */

export const onKeyboardSelection = ({ e, targetElement, itemClass = `item`, selectedClass = "selected", checkByValue, checkByInput, clear }: any) => {
  if (!targetElement.current) return null;

  const config = {
    e: e,
    itemClass: itemClass,
    selectedClass: selectedClass,
  };

  function selectEnter() {
    if (!targetElement.current) return null;
    const text: any = targetElement.current.querySelector(`${config.itemClass}.${config.selectedClass}`);
    if (text) {
      checkByValue(text.dataset.value);
    } else if (targetElement.current.querySelectorAll(`${config.itemClass}`).length > 0) {
      const target: any = targetElement.current.querySelectorAll(`${config.itemClass}.${config.selectedClass}`)[0];
      checkByValue(target.dataset.value);
    } else {
      clear(true, true);
    }
  }

  function selectFirst() {
    if (!targetElement.current) return null;
    const showList = targetElement.current.querySelectorAll(`${config.itemClass}`);
    if (showList.length > 0) {
      showList[0].classList.add(config.selectedClass);
    }
  }

  function selectLast() {
    if (!targetElement.current) return null;
    const showList = targetElement.current.querySelectorAll(`${config.itemClass}`);
    if (showList.length > 0) {
      showList[showList.length - 1].classList.add(config.selectedClass);
    }
  }

  function selectNext(element: any) {
    element.classList.remove(config.selectedClass);
    const next = element.nextElementSibling;
    if (next && next.nodeType !== -1) {
      if (next.classList.contains("item")) {
        next.classList.add(config.selectedClass);
      } else {
        selectNext(next);
      }
    } else {
      selectFirst();
    }
  }

  function selectPrev(element: any) {
    element.classList.remove(config.selectedClass);
    const next = element.previousElementSibling;
    if (next && next.nodeType !== -1) {
      if (next.classList.contains("item")) {
        next.classList.add(config.selectedClass);
      } else {
        selectPrev(next);
      }
    } else {
      selectLast();
    }
  }

  const selected = targetElement.current.querySelector(`${config.itemClass}.${config.selectedClass}`);
  if (e.which == 40) {
    if (selected) {
      selectNext(selected);
    } else {
      selectFirst();
    }
  } else if (e.which == 38) {
    if (selected) {
      selectPrev(selected);
    } else {
      selectLast();
    }
  } else if (e.which == 35) {
    selectLast();
  } else if (e.which == 36) {
    selectFirst();
  } else if (e.which == 13) {
    selectEnter();
  } else if (e.which == 9) {
    checkByInput();
  }

  setScrollListPosition(targetElement);
};

export function setScrollListPosition(targetElement: any) {
  if (targetElement.current) {
    let position = 0;
    const text = targetElement.current.querySelector(".selected");
    if (text) {
      position = text.offsetTop - 35;
    } else if (targetElement.current.querySelector(".active")) {
      position = targetElement.current.querySelector(".active").offsetTop - 35;
    }
    targetElement.current.scrollTop = position;
  }
}


