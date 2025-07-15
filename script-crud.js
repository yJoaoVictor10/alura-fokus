
const btnAdicionarTarefa = document.querySelector('.app__button--add-task');
const formAdicionarTarefa = document.querySelector('.app__form-add-task');
const textArea = document.querySelector('.app__form-textarea');
const ulTarefas = document.querySelector('.app__section-task-list');
const paragrafoDaDescricaoTarefa = document.querySelector('.app__section-active-task-description');
const btnRemoverConcluidas = document.querySelector('#btn-remover-concluidas');
const btnRemoverTodas = document.querySelector('#btn-remover-todas');
const btnExcluirForm = document.querySelector('.app__form-footer__button--cancel');
const btnDeletarInfoForm = document.querySelector('.app__form-footer__button--delete');

let tarefas = JSON.parse(localStorage.getItem('tarefas')) || []; // Vai transformar JSON string em objeto, se não tiver nada em 'tarefas', criará um array vazio
let tarefaSelecionada = null;
let liTarefaSelecionada = null;


function atualizarTarefa(){
    localStorage.setItem('tarefas', JSON.stringify(tarefas)); // Ela salva o array tarefas no armazenamento local do navegador (localStorage), mas como o localStorage só aceita strings, usamos JSON.stringify(tarefas) para converter o array em uma string JSON.
}

function criarElementoTarefa(tarefa){
    const li = document.createElement('li');
    li.classList.add('app__section-task-list-item');

    const svg = document.createElement('svg');
    svg.innerHTML = `
        <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
            <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
        </svg>
    `

    const paragrafo = document.createElement('p');
    paragrafo.textContent = tarefa.descricao;
    paragrafo.classList.add('app__section-task-list-item-description');

    const botao = document.createElement('button');
    botao.classList.add('app_button-edit');

    botao.onclick = ()=>{
        // debugger
        const novaDescricao = prompt('Qual é o novo nome da tarefa?');
        // console.log('Nova descrição da tarefa: ', novaDescricao);
        if(novaDescricao){
            paragrafo.textContent = novaDescricao; // Atualizamos o parágrafo (camada visual)
            tarefa.descricao = novaDescricao; // Atualizamos a referência da tarefa (camada de dados)
            atualizarTarefa(); // Update da localStorage
        }
    }

    const imagemBotao = document.createElement('img');
    imagemBotao.setAttribute('src', '/imagens/edit.png');

    botao.append(imagemBotao); // Adicionando a imagem dentro do botão;

    li.append(svg)
    li.append(paragrafo)
    li.append(botao)

    if(tarefa.completa){
        li.classList.add('app__section-task-list-item-complete');
        botao.setAttribute('disabled', 'disabled');
    }else{
        li.onclick = ()=>{
            document.querySelectorAll('.app__section-task-list-item-active').forEach(elemento =>{
                elemento.classList.remove('app__section-task-list-item-active');
            })
            if(tarefaSelecionada == tarefa){
                paragrafoDaDescricaoTarefa.textContent = '';
                tarefaSelecionada = null;
                liTarefaSelecionada = null
                return
            } 
           tarefaSelecionada = tarefa;
           liTarefaSelecionada = li;
            paragrafoDaDescricaoTarefa.textContent = tarefa.descricao;
            li.classList.add('app__section-task-list-item-active');
        }
    }


    return li;
}

btnAdicionarTarefa.addEventListener('click', ()=>{
    formAdicionarTarefa.classList.toggle('hidden'); // toggle para fazer a alternância da classe hidden
})

btnExcluirForm.addEventListener('click', ()=>{
    formAdicionarTarefa.classList.add('hidden');
})

btnDeletarInfoForm.addEventListener('click', ()=>{
    textArea.value = '';
})

formAdicionarTarefa.addEventListener('submit', (evento)=>{
    evento.preventDefault();
    const tarefa = {
        descricao: textArea.value
    }

    tarefas.push(tarefa); // Adicionando o objeto no Array tarefas
    const elementoDaTarefa = criarElementoTarefa(tarefa);
    ulTarefas.append(elementoDaTarefa);
    atualizarTarefa(); 
    textArea.value = '';
    formAdicionarTarefa.classList.add('hidden');
})

tarefas.forEach(tarefa=>{
    const elementoTarefa = criarElementoTarefa(tarefa);
    ulTarefas.append(elementoTarefa);
})

document.addEventListener('FocoFinalizado', ()=>{
    if(tarefaSelecionada && liTarefaSelecionada){
        liTarefaSelecionada.classList.remove('app__section-task-list-item-active');
        liTarefaSelecionada.classList.add('app__section-task-list-item-complete');
        liTarefaSelecionada.querySelector('button').setAttribute('disabled', 'disabled'); // Desabilitamos o botão
        tarefaSelecionada.completa = true;
        atualizarTarefa(); // Adicionando a propriedade completa = true na LocalStorage
    }
}) // Se o document fizer dispatchEvent()

const removerTarefas = (somenteCompletas)=>{
    const seletor = somenteCompletas ? '.app__section-task-list-item-complete' : '.app__section-task-list-item';
    document.querySelectorAll(seletor).forEach(elemento =>{
        elemento.remove();
    })
    tarefas = somenteCompletas ? tarefas.filter(tarefa => !tarefa.completa) : []; // Filtramos as que não estão completas, pois queremos remover somente as completas, se não for remover apenas completas, remove tudo com '[]'
    atualizarTarefa(); // Atualizar a localStorege
}

btnRemoverConcluidas.onclick = ()=> removerTarefas(true);
btnRemoverTodas.onclick = ()=> removerTarefas(false);