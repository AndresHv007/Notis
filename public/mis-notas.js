document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/insesion.html';
  }

  const notesContainer = document.getElementById('notes-container');
  const logoutBtn = document.getElementById('logout-btn');
  const newNoteBtn = document.getElementById('new-note-btn');
  const notesInfo = document.querySelector('.notes-section-title + span');
  
  const todayBadge = document.getElementById('today-filter-badge');

  todayBadge.addEventListener('click', () => {
    todayBadge.classList.toggle('active');
    fetchNotes();
  });

  const searchInput = document.querySelector('.search-input');

  searchInput.addEventListener('input', (e) => {
    fetchNotes();
  });

  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = '/insesion.html';
  });

  newNoteBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = '/nota.html';
  });

  const fetchNotes = async () => {
    const query = searchInput.value;
    let url = '/api/notes/all';

    if (query) {
      url = `/api/notes/search/all?q=${query}`;
    } else if (todayBadge.classList.contains('active')) {
      url = '/api/notes/today/all';
    }

    try {
      const res = await fetch(url, {
        headers: {
          'x-auth-token': token,
        },
      });

      if (res.ok) {
        const notes = await res.json();
        renderNotes(notes);
        notesInfo.textContent = `${notes.length} notes`;
      } else {
        console.error('Failed to fetch notes');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const renderNotes = (notes) => {
    notesContainer.innerHTML = '';
    notes.forEach((note) => {
      const noteCard = `
        <div class="col-12 col-sm-6 col-md-4 col-lg-3 d-flex mb-4">
          <div class="note-card w-100">
            <span class="note-badge">${note.tag ? note.tag.name : 'General'}</span>
            <div class="note-card-body text-center">
              <h5 class="note-title">${note.title}</h5>
              <p class="note-text">${note.content}</p>
              <div class="d-flex justify-content-between align-items-center">
                <div class="note-meta">
                  <i class="far fa-calendar-alt"></i> ${new Date(note.createdAt).toLocaleDateString()}
                </div>
                <div class="note-actions">
                  <a href="/nota.html?id=${note._id}"><i class="far fa-edit"></i>Editar</a>
                  <a href="#" class="delete-btn" data-id="${note._id}"><i class="far fa-trash-alt"></i>Eliminar</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
      notesContainer.innerHTML += noteCard;
    });

    document.querySelectorAll('.delete-btn').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        const noteId = e.target.closest('.delete-btn').dataset.id;
        if (confirm('¿Estás seguro de que quieres eliminar esta nota?')) {
          try {
            const res = await fetch(`/api/notes/${noteId}`, {
              method: 'DELETE',
              headers: {
                'x-auth-token': token,
              },
            });

            if (res.ok) {
              fetchNotes();
            } else {
              console.error('Failed to delete note');
            }
          } catch (err) {
            console.error(err);
          }
        }
      });
    });
  };

  fetchNotes();
});
