import { useState } from 'react'
import { RADIOLOGY_GROUPS } from '@/data/landing-nav-data'

export function RadMenu() {
  const [activeId, setActiveId] = useState(RADIOLOGY_GROUPS[0].id)
  const group = RADIOLOGY_GROUPS.find((g) => g.id === activeId) ?? RADIOLOGY_GROUPS[0]

  return (
    <div className="rad-panel">
      <div className="rad-side">
        <p className="rad-kicker">Radiology</p>
        {RADIOLOGY_GROUPS.map((cat) => {
          const on = cat.id === activeId
          return (
            <button
              key={cat.id}
              type="button"
              onMouseEnter={() => setActiveId(cat.id)}
              onFocus={() => setActiveId(cat.id)}
              onClick={() => setActiveId(cat.id)}
              className={`rad-cat${on ? ' on' : ''}`}
            >
              {cat.label}
              <small>{cat.items.length}</small>
            </button>
          )
        })}
      </div>
      <div className="rad-main">
        <div className="rad-head">
          <div>
            <h3>{group.label}</h3>
            <p>{group.note ?? 'Nashik Radiological & Imaging Association'}</p>
          </div>
          <p>{group.items.length} studies</p>
        </div>
        <div className="rad-list">
          {group.items.map((item) => (
            <div key={item.name} className="rad-row">
              <p className="rad-name">
                {item.name}
                {item.detail ? <span>{item.detail}</span> : null}
              </p>
              <span className="rad-price">{item.price}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
