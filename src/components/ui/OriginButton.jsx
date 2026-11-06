import { useState, useRef, useCallback, useLayoutEffect, forwardRef } from 'react';

function getCoverDiameter(width, height, x, y) {
  return Math.ceil(
    2 *
      Math.max(
        Math.hypot(x, y),
        Math.hypot(width - x, y),
        Math.hypot(x, height - y),
        Math.hypot(width - x, height - y)
      )
  );
}

function assignRef(ref, value) {
  if (typeof ref === 'function') {
    ref(value);
  } else if (ref) {
    ref.current = value;
  }
}

export const OriginButton = forwardRef(function OriginButton(
  {
    children,
    className = '',
    variant = 'outline', // 'primary' | 'outline'
    disabled = false,
    loading = false,
    type = 'button',
    onClick,
    onBlur,
    onFocus,
    onKeyDown,
    onKeyUp,
    onPointerDown,
    onPointerEnter,
    onPointerLeave,
    onPointerUp,
    onPointerCancel,
    ...props
  },
  ref
) {
  const buttonRef = useRef(null);
  const isDisabled = Boolean(disabled || loading);
  const [hovered, setHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [origin, setOrigin] = useState({ x: 0, y: 0 });
  const [coverSize, setCoverSize] = useState(0);

  const updateOrigin = useCallback((x, y) => {
    const node = buttonRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    setOrigin({ x, y });
    setCoverSize(getCoverDiameter(rect.width, rect.height, x, y));
  }, []);

  const updateOriginFromPointer = useCallback(
    (event) => {
      const rect = event.currentTarget.getBoundingClientRect();
      updateOrigin(event.clientX - rect.left, event.clientY - rect.top);
    },
    [updateOrigin]
  );

  const updateOriginFromCenter = useCallback(() => {
    const node = buttonRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    updateOrigin(rect.width / 2, rect.height / 2);
  }, [updateOrigin]);

  const showFill = !isDisabled && (hovered || isPressed);

  useLayoutEffect(() => {
    const node = buttonRef.current;
    if (!(node && showFill)) return;

    const measure = () => {
      const rect = node.getBoundingClientRect();
      setCoverSize(getCoverDiameter(rect.width, rect.height, origin.x, origin.y));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);

    if (document.fonts?.ready) {
      document.fonts.ready.then(measure).catch(() => undefined);
    }

    return () => observer.disconnect();
  }, [showFill, origin.x, origin.y]);

  const setMergedRef = useCallback(
    (node) => {
      buttonRef.current = node;
      assignRef(ref, node);
    },
    [ref]
  );

  const variantClass = variant === 'primary' ? 'origin-btn-primary' : 'origin-btn-outline';

  return (
    <button
      {...props}
      ref={setMergedRef}
      type={type}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      data-pressed={isPressed ? 'true' : 'false'}
      className={`origin-btn ${variantClass} ${showFill ? 'is-filled' : ''} ${className}`}
      onClick={onClick}
      onBlur={(e) => {
        onBlur?.(e);
        setIsPressed(false);
        if (!e.defaultPrevented) setHovered(false);
      }}
      onFocus={(e) => {
        onFocus?.(e);
        if (isDisabled || e.defaultPrevented) return;
        if (e.currentTarget.matches(':focus-visible')) {
          updateOriginFromCenter();
          setHovered(true);
        }
      }}
      onKeyDown={(e) => {
        onKeyDown?.(e);
        if (e.defaultPrevented || isDisabled || e.repeat) return;
        if (e.key === ' ' || e.key === 'Enter') {
          if (e.key === ' ') e.preventDefault();
          updateOriginFromCenter();
          setIsPressed(true);
          setHovered(true);
        }
      }}
      onKeyUp={(e) => {
        onKeyUp?.(e);
        if (e.key === ' ' || e.key === 'Enter') {
          setIsPressed(false);
          if (!e.currentTarget.matches(':focus-visible')) {
            setHovered(false);
          }
        }
      }}
      onPointerCancel={(e) => {
        onPointerCancel?.(e);
        setIsPressed(false);
      }}
      onPointerDown={(e) => {
        onPointerDown?.(e);
        if (e.defaultPrevented || isDisabled || e.button !== 0) return;
        updateOriginFromPointer(e);
        setIsPressed(true);
        setHovered(true);
      }}
      onPointerEnter={(e) => {
        onPointerEnter?.(e);
        if (isDisabled || e.defaultPrevented) return;
        updateOriginFromPointer(e);
        setHovered(true);
      }}
      onPointerLeave={(e) => {
        onPointerLeave?.(e);
        setHovered(false);
        setIsPressed(false);
      }}
      onPointerUp={(e) => {
        onPointerUp?.(e);
        setIsPressed(false);
      }}
    >
      <span
        aria-hidden="true"
        className="origin-btn-fill"
        style={{
          width: coverSize ? `${coverSize}px` : 0,
          height: coverSize ? `${coverSize}px` : 0,
          left: `${origin.x}px`,
          top: `${origin.y}px`,
          transform: `translate(-50%, -50%) scale(${showFill && coverSize > 0 ? 1 : 0})`,
        }}
      />
      <span className="origin-btn-content">{children}</span>
    </button>
  );
});

OriginButton.displayName = 'OriginButton';
export default OriginButton;
