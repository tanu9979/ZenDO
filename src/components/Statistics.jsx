import React, { useEffect, useState } from 'react';

const LABELS = [
  { value: 'study', text: 'Study', color: '#42a5f5' },
  { value: 'meditation', text: 'Meditation', color: '#ab47bc' },
  { value: 'extra', text: 'Extra Curricular', color: '#26a69a' },
  { value: 'rest', text: 'Rest', color: '#ffa726' },
  { value: 'project', text: 'Project', color: '#ef5350' }
];

function getLabelStats(todos) {
  const stats = {};
  LABELS.forEach(l => { stats[l.value] = 0; });
  todos.forEach(todo => {
    if (stats.hasOwnProperty(todo.label)) stats[todo.label]++;
  });
  return stats;
}

function getPieSegments(stats) {
  const total = Object.values(stats).reduce((a, b) => a + b, 0);
  let acc = 0;
  return LABELS.map(l => {
    const value = stats[l.value];
    const percent = total ? value / total : 0;
    const start = acc;
    acc += percent;
    return {
      ...l,
      value,
      percent,
      startAngle: start * 360,
      endAngle: (start + percent) * 360
    };
  });
}

function describeArc(cx, cy, r, startAngle, endAngle) {
  const rad = (deg) => (Math.PI / 180) * deg;
  const x1 = cx + r * Math.cos(rad(startAngle - 90));
  const y1 = cy + r * Math.sin(rad(startAngle - 90));
  const x2 = cx + r * Math.cos(rad(endAngle - 90));
  const y2 = cy + r * Math.sin(rad(endAngle - 90));
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return [
    `M ${cx} ${cy}`,
    `L ${x1} ${y1}`,
    `A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`,
    'Z'
  ].join(' ');
}

const Statistics = () => {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('todos');
    if (saved) setTodos(JSON.parse(saved));
  }, []);

  const stats = getLabelStats(todos);
  const segments = getPieSegments(stats);
  const total = Object.values(stats).reduce((a, b) => a + b, 0);

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '2.5rem 1rem', color: 'var(--theme-text, #fff)' }}>
      <h1 style={{
        color: 'var(--theme-accent, #4CAF50)',
        fontWeight: 800,
        fontSize: '2.2rem',
        marginBottom: '2rem',
        letterSpacing: '-1px'
      }}>Task Distribution by Label</h1>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <svg width={260} height={260} viewBox="0 0 260 260">
          {/* Faint background circle for visibility */}
          <circle cx={130} cy={130} r={100} fill="#23272e" opacity="0.18" />
          {segments.map((seg, i) =>
            seg.value > 0 && (
              <path
                key={seg.value + '-' + i}
                d={describeArc(130, 130, 100, seg.startAngle, seg.endAngle)}
                fill={seg.color}
                stroke="#23272e"
                strokeWidth="2"
                opacity="0.95"
              />
            )
          )}
        </svg>
        {total === 0 && (
          <div style={{ marginTop: 24, color: '#aaa', fontStyle: 'italic', fontSize: '1.1rem' }}>
            No tasks to show. Add some tasks with labels!
          </div>
        )}
        <div style={{ marginTop: 24, width: '100%' }}>
          {LABELS.map(l => (
            <div key={l.value} style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
              <span style={{
                display: 'inline-block',
                width: 18,
                height: 18,
                borderRadius: 4,
                background: l.color,
                marginRight: 10
              }} />
              <span style={{ fontWeight: 600 }}>{l.text}</span>
              <span style={{ marginLeft: 'auto', opacity: 0.8 }}>
                {stats[l.value]} task{stats[l.value] !== 1 ? 's' : ''}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Statistics; 