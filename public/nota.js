document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/insesion.html';
  }

  const titleInput = document.getElementById('titulo');
  const tagInput = document.getElementById('etiqueta');
  const contentInput = document.getElementById('contenido');
  const saveBtn = document.getElementById('save-note-btn');
  const backBtn = document.getElementById('back-btn');

  const urlParams = new URLSearchParams(window.location.search);
  const noteId = urlParams.get('id');

  if (noteId) {
    // Edit mode
    fetch(`/api/notes/${noteId}`, {
      headers: {
        'x-auth-token': token,
      },
    })
      .then((res) => res.json())
      .then((note) => {
        titleInput.value = note.title;
        tagInput.value = note.tag ? note.tag.name : '';
        contentInput.value = note.content;
      });
  }

  saveBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    const tag = tagInput.value.trim();
    if (tag.includes(' ') || tag.includes(',')) {
      alert('Only one tag is allowed, and it cannot contain spaces or commas.');
      return;
    }

    const noteData = {
      title: titleInput.value,
      tag: tag,
      content: contentInput.value,
    };

    try {
      const url = noteId ? `/api/notes/${noteId}` : '/api/notes';
      const method = noteId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify(noteData),
      });

      if (res.ok) {
        window.location.href = '/inicio.html';
      } else {
        const data = await res.json();
        alert(data.msg);
      }
    } catch (err) {
      console.error(err);
      alert('Server error');
    }
  });

  backBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = '/inicio.html';
  });
});
