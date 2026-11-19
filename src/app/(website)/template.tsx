/** Page-enter transition in pure CSS: no JS cost, no navigation delay, and content is never hidden (good LCP). */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
