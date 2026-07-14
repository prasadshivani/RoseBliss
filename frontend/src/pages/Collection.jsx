import React from 'react'

const Collection = () => {
  const collections = [
    { name: 'Lipsticks', icon: '👄', color: 'pink' },
    { name: 'Nail Polish', icon: '💅', color: 'purple' },
    { name: 'Skincare', icon: '🧴', color: 'blue' },
    { name: 'Makeup Kits', icon: '💄', color: 'red' },
    { name: 'Perfumes', icon: '🌹', color: 'gold' }
  ]

  return (
    <div style={{ padding: '40px', background: 'linear-gradient(135deg, #ffebee 0%, #f8bbd9 100%)', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', color: '#c2185b', fontSize: '3rem', marginBottom: '40px' }}>
        Collections
      </h1>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '20px', 
        maxWidth: '1200px', 
        margin: '0 auto' 
      }}>
        {collections.map((item, index) => (
          <div key={index} style={{
            background: 'white',
            borderRadius: '20px',
            padding: '30px',
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            transform: 'translateY(0)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-10px)'
            e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.2)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)'
          }}
          >
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>
              {item.icon}
            </div>
            <h2 style={{ 
              fontSize: '1.5rem', 
              color: '#c2185b', 
              margin: '0 0 10px 0',
              fontWeight: 'bold'
            }}>
              {item.name}
            </h2>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Collection
