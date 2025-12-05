document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/insesion.html';
  }

  const notesContainer = document.getElementById('notes-container');
  const logoutBtn = document.getElementById('logout-btn');
  const newNoteBtn = document.getElementById('new-note-btn');
  const notesInfo = document.querySelector('.notes-section-title + span');
  const paginationContainer = document.querySelector('.notis-pagination');
  
  let currentPage = 1;

  const todayBadge = document.getElementById('today-filter-badge');

  todayBadge.addEventListener('click', () => {
    todayBadge.classList.toggle('active');
    fetchNotes(1);
  });

  const searchInput = document.querySelector('.search-input');

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value;
    fetchNotes(1, query);
  });

  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = '/insesion.html';
  });

  newNoteBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = '/nota.html';
  });

  const fetchNotes = async (page = 1, query = '') => {
    currentPage = page;
    let url = `/api/notes?page=${page}&limit=4`;

    if (query) {
      url = `/api/notes/search?q=${query}&page=${page}&limit=4`;
    } else if (todayBadge.classList.contains('active')) {
      url = `/api/notes/today?page=${page}&limit=4`;
    }

    try {
      const res = await fetch(url, {
        headers: {
          'x-auth-token': token,
        },
      });

      if (res.ok) {
        const data = await res.json();
        renderNotes(data.notes);
        renderPagination(data.totalPages, data.currentPage);
        notesInfo.textContent = `${data.totalNotes} notes • Page ${data.totalNotes === 0 ? 0 : data.currentPage} of ${data.totalPages}`;
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
              fetchNotes(currentPage);
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

  const renderPagination = (totalPages, currentPage) => {
    paginationContainer.innerHTML = '';
    if (totalPages <= 1) return;

    // Previous button
    const prevLi = document.createElement('li');
    prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    const prevA = document.createElement('a');
    prevA.className = 'page-link';
    prevA.href = '#';
    prevA.innerHTML = '&laquo;';
    prevA.addEventListener('click', (e) => {
      e.preventDefault();
      if (currentPage > 1) fetchNotes(currentPage - 1);
    });
    prevLi.appendChild(prevA);
    paginationContainer.appendChild(prevLi);

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
      const pageLi = document.createElement('li');
      pageLi.className = `page-item ${i === currentPage ? 'active' : ''}`;
      const pageA = document.createElement('a');
      pageA.className = 'page-link';
      pageA.href = '#';
      pageA.textContent = i;
      pageA.addEventListener('click', (e) => {
        e.preventDefault();
        fetchNotes(i);
      });
      pageLi.appendChild(pageA);
      paginationContainer.appendChild(pageLi);
    }

    // Next button
    const nextLi = document.createElement('li');
    nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
    const nextA = document.createElement('a');
    nextA.className = 'page-link';
    nextA.href = '#';
    nextA.innerHTML = '&raquo;';
    nextA.addEventListener('click', (e) => {
      e.preventDefault();
      if (currentPage < totalPages) fetchNotes(currentPage + 1);
    });
    nextLi.appendChild(nextA);
    paginationContainer.appendChild(nextLi);
  };

  fetchNotes(1);
});
