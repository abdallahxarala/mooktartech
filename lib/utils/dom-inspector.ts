export function inspectElement(element: HTMLElement | null) {
  if (!element) {
    console.warn("[DOMInspector] Element not found");
    return;
  }

  const styles = window.getComputedStyle(element);
  
  console.group("[DOMInspector] Element Details");
  console.log("Element:", element);
  console.log("Tag:", element.tagName);
  console.log("Classes:", element.className);
  console.log("ID:", element.id);
  console.log("Dimensions:", {
    width: element.offsetWidth,
    height: element.offsetHeight,
    clientWidth: element.clientWidth,
    clientHeight: element.clientHeight,
  });
  console.log("Position:", {
    top: styles.top,
    left: styles.left,
    position: styles.position,
    zIndex: styles.zIndex,
  });
  console.log("Visibility:", {
    display: styles.display,
    visibility: styles.visibility,
    opacity: styles.opacity,
    overflow: styles.overflow,
  });
  console.log("Transform:", styles.transform);
  console.groupEnd();

  // Highlight the element temporarily
  const originalOutline = element.style.outline;
  element.style.outline = "2px solid red";
  setTimeout(() => {
    element.style.outline = originalOutline;
  }, 3000);
}

export function inspectParentChain(element: HTMLElement | null) {
  if (!element) {
    console.warn("[DOMInspector] Element not found");
    return;
  }

  let current: HTMLElement | null = element;
  const chain: HTMLElement[] = [];

  while (current) {
    chain.push(current);
    current = current.parentElement;
  }

  console.group("[DOMInspector] Parent Chain");
  chain.forEach((el, index) => {
    console.group(`Level ${index}: ${el.tagName}`);
    console.log("Element:", el);
    console.log("Classes:", el.className);
    console.log("Styles:", window.getComputedStyle(el));
    console.groupEnd();
  });
  console.groupEnd();
}

export function findHiddenElements() {
  const elements = document.querySelectorAll("*");
  const hidden: HTMLElement[] = [];

  elements.forEach((el) => {
    const styles = window.getComputedStyle(el as HTMLElement);
    if (
      styles.display === "none" ||
      styles.visibility === "hidden" ||
      styles.opacity === "0" ||
      (styles.height === "0px" && styles.overflow === "hidden")
    ) {
      hidden.push(el as HTMLElement);
    }
  });

  console.group("[DOMInspector] Hidden Elements");
  hidden.forEach((el, index) => {
    console.group(`Hidden Element ${index + 1}`);
    console.log("Element:", el);
    console.log("Reason:", {
      display: el.style.display === "none",
      visibility: el.style.visibility === "hidden",
      opacity: el.style.opacity === "0",
      height: el.style.height === "0px" && el.style.overflow === "hidden",
    });
    console.groupEnd();
  });
  console.groupEnd();

  return hidden;
}