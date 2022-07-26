const init = () => {

 
	if (!getItem()) {
		pegarDados()
	}
	preencherTabela(getItem());
	preencherTabela(pagination());
}

const pegarDados = () => {
fetch("https://jsonplaceholder.typicode.com/posts")
	.then((response) => response.json())
	.then(json => {
		setItem(json);
		preencherTabela(json);
		pagination(1);
	});
};

const setItem = json => localStorage.setItem('originalItems', JSON.stringify(json))

const getItem = () => JSON.parse(localStorage.getItem('originalItems'));



const preencherTabela = guias => {

	let tabela = guias.reduce((print, guides) => {

		print += `<tr>
									<td>${guides.id}</td>
									<td>${guides.title}</td>
									<td><div class="dropdown">
										<button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
										Ações</button>
										<div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
											<a class="dropdown-item" href="#" id="editar" data-toggle="modal" data-target="#exampleModal" onclick="editModal(${guides.id})">Editar</a>
											<a class="dropdown-item" href="#" id="remover" onclick="removeModal (${guides.id})">Remover</a>
										</div>
										</div></td>
							</tr>`

		return print
	}, '')

	document.getElementById('main-tbl').innerHTML = tabela;
};

let items = [];

let _pagination = {}

const pagination = (value, table = getItem()) => {

  let page = ~~value || 1;
  const limit = 20;
  const offset = (page - 1) * limit;
  const total = table.length;
  items = table.slice(offset, offset + limit);

  let pageSize = Math.ceil(total / limit);

  _pagination = {
    page: page,
    total: total,
    limit: limit,
    pages: pageSize
  };

  const paginationResult = _pagination;

  let paginationItems = `<button class="pagination_link" onclick="previousPage()" style="margin:5px" id="previousPage"><<</button>`;

  for (let i = 1; i <= paginationResult.pages; i++) {
    paginationItems += `<button class="pagination_link" onclick="pagination(${i})" style="margin:5px" id="atual">${i}</button>`
  };

  paginationItems += `<button class="pagination_link" onclick="nextPage()" style="margin:5px" id="nextPage">>></button>`;

  document.getElementById('pagination_link').innerHTML = paginationItems;

  preencherTabela(items);
};

const nextPage = () => {

  if (_pagination.page === _pagination.pages) {
    return;
  }
  pagination(_pagination.page + 1);
}

const previousPage = () => {

  if (_pagination.page === 1) {
    return;
  }
  pagination(_pagination.page - 1);
}

const editModal = id => {
	const div = document.getElementById('exampleModalLabel');
	const title = document.getElementById("recipient-name");
	const body = document.getElementById("message-text");
	const saveBtn = document.getElementById('save-btn');

	div.innerHTML = `Editar Post ${id}`;

	const teste = getItem().find(t => t.id === id);
	title.value = teste.title
	body.value = teste.body

	saveBtn.onclick = () => {
		const testeMap = getItem().map(test => {
			if (test.id === ~~id) {
				test.title = title.value;
				test.body = body.value;
			}

			return test;
		});

		setItem(testeMap);

		Swal.fire({
			position: 'center',
			icon: 'success',
			title: 'Suas alterações foram salvas!',
			showConfirmButton: false,
			timer: 1500
		});

		preencherTabela(testeMap);
		preencherTabela(pagination());
	};
};

const removeModal = id => {
	Swal.fire({
		title: 'Tem certeza?',
		text: "Não vai ser possível alterar!",
		icon: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: 'Sim'
	})
	.then(result => {
		if (result.isConfirmed) {
			const titleFilter = getItem().filter(remove => remove.id !== id);

			setItem(titleFilter);

			Swal.fire(
				'Excluído!',
				'Seu título foi excluído!',
				'success'
			).then(() => filter());
				
		}
	});
};

const btnReload = document.getElementById('reload');

btnReload.onclick = () => {

	localStorage.clear('');
	init();
}

const filter = () => {
	const inputValue = document.getElementById('search-box').value
	const inputNormalize = inputValue.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

	if (!inputNormalize) {
		pagination(1, getItem());
		return;
	}

	const guiasFiltradas = getItem().filter(guide => {
		const tituloNormalize = guide.title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

		if (inputNormalize && !tituloNormalize.includes(inputNormalize)) return false;

		return true;
	});

	pagination(1, guiasFiltradas);
};

init();