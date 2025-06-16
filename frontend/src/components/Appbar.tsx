// // zenithpost Appbar component
// // appbar contains: name/logo, search bar, write post button, and user profile menu

import { NotebookPen, User, LogOut, Search } from 'lucide-react';

const Appbar = () => {
  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 24px',
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e5e7eb',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '24px'
      }}>
        <span style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#1f2937'
        }}>ZenithPost</span>

        <div style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center'
        }}>
          <input
            type="text"
            placeholder="Search..."
            style={{
              padding: '8px 40px 8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              width: '300px',
              outline: 'none'
            }}
          />
          <Search
            size={18}
            style={{
              position: 'absolute',
              right: '12px',
              color: '#6b7280',
              pointerEvents: 'none'
            }}
          />
        </div>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}>
        <button style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          backgroundColor: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '500',
          cursor: 'pointer'
        }}>
          <NotebookPen size={16} />
          Write Post
        </button>


        <button style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          backgroundColor: '#ef4444',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '500',
          cursor: 'pointer'
        }}>
          <LogOut size={16} />
          Logout
        </button>

        <button style={{
          padding: '8px 16px',
          backgroundColor: 'transparent',
          color: '#374151',
          border: '1px solid #d1d5db',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '500',
          cursor: 'pointer'
        }}>
          Sign In
        </button>

        <button style={{
          padding: '8px 16px',
          backgroundColor: '#10b981',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '500',
          cursor: 'pointer'
        }}>
          Sign Up
        </button>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 12px',
        backgroundColor: '#f9fafb',
        borderRadius: '8px'
      }}>
        <User size={16} color="#6b7280" />
        <span style={{ fontSize: '14px', color: '#374151' }}>User</span>
      </div>
    </nav>
  )
}

export default Appbar;