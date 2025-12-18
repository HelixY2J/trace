export type ToastKind = "success" | "error" | "info";

export function showToast(title: string, message: string, kind: ToastKind = "info", timeoutMs = 2400) {
  if (typeof document === "undefined") return;
  const wrap = document.createElement("div");
  wrap.style.position = "fixed";
  wrap.style.right = "16px";
  wrap.style.bottom = "16px";
  wrap.style.zIndex = "10000";
  wrap.style.pointerEvents = "none";

  const el = document.createElement("div");
  el.style.pointerEvents = "auto";
  el.style.padding = "8px 12px";
  el.style.borderRadius = "8px";
  el.style.border = "1px solid #353539";
  el.style.background = "#212126";
  el.style.color = "#e8edf0";
  el.style.boxShadow = "0 4px 16px rgba(0,0,0,0.25)";
  if (kind === "success") el.style.borderColor = "#22c55e";
  if (kind === "error") el.style.borderColor = "#ef4444";

  const titleEl = document.createElement("div");
  titleEl.textContent = title;
  titleEl.style.fontWeight = "600";
  titleEl.style.fontSize = "13px";
  titleEl.style.marginBottom = "4px";

  const bodyEl = document.createElement("div");
  bodyEl.textContent = message;
  bodyEl.style.fontSize = "12px";
  bodyEl.style.opacity = "0.9";

  el.appendChild(titleEl);
  el.appendChild(bodyEl);
  wrap.appendChild(el);
  document.body.appendChild(wrap);
  setTimeout(() => {
    wrap.remove();
  }, timeoutMs);
}


