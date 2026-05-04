export default function SectionRow({ title, children, last }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '200px 1fr',
      gap: 48,
      paddingBottom: last ? 0 : 40,
      marginBottom: last ? 0 : 40,
      borderBottom: last ? 'none' : '1px solid var(--border-subtle)',
    }}>
      <div style={{ paddingTop: 4 }}>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: 'var(--text-default)' }}>
          {title}
        </h3>
      </div>
      <div>{children}</div>
    </div>
  );
}
