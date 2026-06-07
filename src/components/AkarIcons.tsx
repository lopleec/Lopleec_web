import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & {
  color?: string;
  size?: number | string;
  strokeWidth?: number | string;
};

const baseStrokeProps = (
  color: string,
  size: number | string,
  strokeWidth: number | string,
) => ({
  fill: 'none',
  height: size,
  stroke: color,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  strokeWidth,
  viewBox: '0 0 24 24',
  width: size,
  xmlns: 'http://www.w3.org/2000/svg',
});

export function ArrowLeft({
  color = 'currentColor',
  size = 24,
  strokeWidth = 2,
  ...props
}: IconProps) {
  return (
    <svg {...baseStrokeProps(color, size, strokeWidth)} {...props}>
      <path d="M11 5l-7 7 7 7" />
      <path d="M4 12h16" />
    </svg>
  );
}

export function ArrowUpRight({
  color = 'currentColor',
  size = 24,
  strokeWidth = 2,
  ...props
}: IconProps) {
  return (
    <svg {...baseStrokeProps(color, size, strokeWidth)} {...props}>
      <path d="M18 6L6 18" />
      <path d="M8 6h10v10" />
    </svg>
  );
}

export function ChevronDown({
  color = 'currentColor',
  size = 24,
  strokeWidth = 2,
  ...props
}: IconProps) {
  return (
    <svg {...baseStrokeProps(color, size, strokeWidth)} {...props}>
      <path d="M4 9l8 8 8-8" />
    </svg>
  );
}

export function Envelope({
  color = 'currentColor',
  size = 24,
  strokeWidth = 2,
  ...props
}: IconProps) {
  return (
    <svg {...baseStrokeProps(color, size, strokeWidth)} {...props}>
      <path d="M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6z" />
      <path d="M2 8l7.501 6.001a4 4 0 0 0 4.998 0L22 8" />
    </svg>
  );
}

export function Gear({
  color = 'currentColor',
  size = 24,
  strokeWidth = 2,
  ...props
}: IconProps) {
  return (
    <svg {...baseStrokeProps(color, size, strokeWidth)} {...props}>
      <path d="M14 3.269C14 2.568 13.432 2 12.731 2H11.27C10.568 2 10 2.568 10 3.269v0c0 .578-.396 1.074-.935 1.286-.085.034-.17.07-.253.106-.531.23-1.162.16-1.572-.249v0a1.269 1.269 0 0 0-1.794 0L4.412 5.446a1.269 1.269 0 0 0 0 1.794v0c.41.41.48 1.04.248 1.572a7.946 7.946 0 0 0-.105.253c-.212.539-.708.935-1.286.935v0C2.568 10 2 10.568 2 11.269v1.462C2 13.432 2.568 14 3.269 14v0c.578 0 1.074.396 1.286.935.034.085.07.17.105.253.231.531.161 1.162-.248 1.572v0a1.269 1.269 0 0 0 0 1.794l1.034 1.034a1.269 1.269 0 0 0 1.794 0v0c.41-.41 1.04-.48 1.572-.249.083.037.168.072.253.106.539.212.935.708.935 1.286v0c0 .701.568 1.269 1.269 1.269h1.462c.701 0 1.269-.568 1.269-1.269v0c0-.578.396-1.074.935-1.287.085-.033.17-.068.253-.104.531-.232 1.162-.161 1.571.248v0a1.269 1.269 0 0 0 1.795 0l1.034-1.034a1.269 1.269 0 0 0 0-1.794v0c-.41-.41-.48-1.04-.249-1.572.037-.083.072-.168.106-.253.212-.539.708-.935 1.286-.935v0c.701 0 1.269-.568 1.269-1.269V11.27c0-.701-.568-1.269-1.269-1.269v0c-.578 0-1.074-.396-1.287-.935a7.755 7.755 0 0 0-.105-.253c-.23-.531-.16-1.162.249-1.572v0a1.269 1.269 0 0 0 0-1.794l-1.034-1.034a1.269 1.269 0 0 0-1.794 0v0c-.41.41-1.04.48-1.572.249a7.913 7.913 0 0 0-.253-.106C14.396 4.343 14 3.847 14 3.27v0z" />
      <path d="M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z" />
    </svg>
  );
}

export function GithubFill({
  color = 'currentColor',
  size = 24,
  ...props
}: Omit<IconProps, 'strokeWidth'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"
      />
    </svg>
  );
}

export function LinkChain({
  color = 'currentColor',
  size = 24,
  strokeWidth = 2,
  ...props
}: IconProps) {
  return (
    <svg {...baseStrokeProps(color, size, strokeWidth)} {...props}>
      <path d="M13.544 10.456a4.368 4.368 0 0 0-6.176 0l-3.089 3.088a4.367 4.367 0 1 0 6.177 6.177L12 18.177" />
      <path d="M10.456 13.544a4.368 4.368 0 0 0 6.176 0l3.089-3.088a4.367 4.367 0 1 0-6.177-6.177L12 5.823" />
    </svg>
  );
}

export function Star({
  color = 'currentColor',
  size = 24,
  strokeWidth = 2,
  ...props
}: IconProps) {
  return (
    <svg {...baseStrokeProps(color, size, strokeWidth)} {...props}>
      <path d="M12 3.5l2.55 5.167 5.703.828-4.127 4.022.974 5.683L12 16.517 6.9 19.2l.974-5.683-4.127-4.022 5.703-.828L12 3.5z" />
    </svg>
  );
}

export function Branch({
  color = 'currentColor',
  size = 24,
  strokeWidth = 2,
  ...props
}: IconProps) {
  return (
    <svg {...baseStrokeProps(color, size, strokeWidth)} {...props}>
      <path d="M7 6a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5z" />
      <path d="M17 13a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5z" />
      <path d="M7 11v2c0 2.761 2.239 5 5 5h2.5" />
      <path d="M7 6v-.5A3.5 3.5 0 0 1 10.5 2H17a2.5 2.5 0 1 1 0 5h-2.5" />
    </svg>
  );
}
