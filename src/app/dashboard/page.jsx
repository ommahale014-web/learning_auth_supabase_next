import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { logout, addNote } from './actions'

export default async function Dashboard() {
  const supabase = await createClient()

  // Step 1 - get user
  const { data: { user }, error } = await supabase.auth.getUser()

  // Step 2 - protect route
  if (error || !user) {
    redirect('/login')
  }

  // Step 3 - fetch ONLY this user's notes
  const { data: notes = [] } = await supabase
    .from('notes')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px 20px'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '12px',
        padding: '40px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
      }}>

        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              marginBottom: '10px',
              color: '#333'
            }}>
              Welcome! 👋
            </h1>
            <p style={{
              color: '#666',
              fontSize: '1.1rem'
            }}>
              {user.email}
            </p>
          </div>

          {/* Logout */}
          <form action={logout}>
            <button
              type="submit"
              style={{
                padding: '12px 24px',
                background: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          </form>
        </div>

        {/* Success box */}
        <div style={{
          padding: '30px',
          background: '#f8f9fa',
          borderRadius: '8px',
          textAlign: 'center',
          marginBottom: '30px'
        }}>
          <p style={{
            fontSize: '1.2rem',
            color: '#28a745',
            fontWeight: '500',
            margin: 0
          }}>
            🎉 You are successfully logged in!
          </p>
        </div>

        {/* Add Note */}
        <div style={{
          padding: '30px',
          background: '#f8f9fa',
          borderRadius: '8px',
          marginBottom: '30px'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            marginBottom: '20px',
            color: '#333'
          }}>
            Add a Note 📝
          </h2>

          <form action={addNote} style={{
            display: 'flex',
            gap: '10px',
            flexWrap: 'wrap'
          }}>
            <input
              type="text"
              name="title"
              placeholder="Enter note title..."
              required
              style={{
                flex: '1',
                minWidth: '200px',
                padding: '12px 16px',
                fontSize: '1rem',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                outline: 'none',
                color: 'black'
              }}
            />
            <button
              type="submit"
              style={{
                padding: '12px 24px',
                background: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              Add Note
            </button>
          </form>
        </div>

        {/* Notes List */}
        <div style={{
          padding: '30px',
          background: '#f8f9fa',
          borderRadius: '8px'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            marginBottom: '20px',
            color: '#333'
          }}>
            Your Notes
          </h2>

          {notes.length === 0 ? (
            <div style={{
              padding: '20px',
              background: 'white',
              borderRadius: '10px',
              border: '1px dashed #d0d0d0',
              color: '#666',
              textAlign: 'center'
            }}>
              No notes yet. Add your first note above.
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '12px'
            }}>
              {notes.map(note => (
                <div
                  key={note.id}
                  style={{
                    background: 'white',
                    borderRadius: '10px',
                    padding: '16px',
                    border: '1px solid #eee',
                    boxShadow: '0 6px 18px rgba(0, 0, 0, 0.06)'
                  }}
                >
                  <div style={{
  fontSize: '1.05rem',
  fontWeight: '700',
  color: '#222',
  marginBottom: '8px',
  wordBreak: 'break-word'
}}>
  {typeof note.title === 'string'
    ? note.title
    : note.title?.title || '(Untitled)'}
</div>

                  <div style={{
                    fontSize: '0.9rem',
                    color: '#777'
                  }}>
                    {new Date(note.created_at).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
