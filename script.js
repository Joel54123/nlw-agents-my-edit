const button = document.querySelector(`button`);
const form = document.querySelector("form");
const responseSpace = document.getElementById('iaResponse');

const markdownToHTML = (text) => {
    const converter = new showdown.Converter();
    return converter.makeHtml(text);
}

const perguntarAI = async (apiKey, game, question) => {
    const model = "gemini-2.5-flash";
    const geminiURL =`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const pergunta = `
    ## Especialidade
    Você é um especialista assistente de meta para o jogo ${game}

    ## Tarefa
    Você deve responder as perguntas do usuário com base no seu conhecimento do jogo, estratégias, build e dicas

    ## Regras
    - Se você não sabe a resposta, responda com 'Não sei' e não tente inventar uma resposta.
    - Se a pergunta não está relacionada ao jogo, responda com 'Essa pergunta não está relacionada ao jogo'
    - Considere a data atual ${new Date().toLocaleDateString()}
    - Faça pesquisas atualizadas sobre o patch atual, baseado na data atual, para dar uma resposta coerente.
    - Nunca responsda itens que vc não tenha certeza de que existe no patch atual.
    - Se o jogo for o clash royale considere os decks tradicionais e os deck meta como opcoes apropriadas.
    - Sempre que sugerir um deck considere cartas que tenham sinergia como o caso do "corredor e terremo ou gigante real e pescador" nunca sugira cartas que nao tenham sinergia como por exemplo pekka em um deck log bait.
    - Considere sempre sugerir duas cartas que tenham evolução no deck.

    ## Resposta
    - Economize na resposta, seja direto mas explique bem o contexto e aplicação.
    - Responda em markdown
    - Não precisa fazer nenhuma saudação ou despedida, apenas responda o que o usuário está querendo.

    ## Exemplo de resposta
    pergunta do usuário: Melhor deck meta da atualidade
    resposta: Deck: \n\n **Conceitos gerais do deck e como usa-lo:**\n\n Coloque aqui o conceito e explique a funcao de cada carta, indique aqui tambem se houver alguma carta com evolução que faca sentido usar.\n\n**Cartas:**\n\nColoque as cartas aqui separe por condicao de vitoria, tank, defesa aérea, construão (se for o caso), feiticos, distração. Se for necessario acrescentar algo ou mudar a ordem da lista fique avontade.\n\n **Decks counter:**\n\n exemplo de decks counter\n\n **Se for necessario acrescentar mais alguma informacao importante acrescente aqui.

    ---
    Aqui está a pergunta do usuário: ${question}
    `;

    const contents = [{
        parts: [{
            text: pergunta
        }]
    }]

    // Chamada API
    const response = await fetch(geminiURL, {
       method: 'POST',
       headers: {
        'Content-Type': 'application/json'
       },
       body: JSON.stringify({contents})
    });

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
    
}

const enviarFormulario = async (event) => {
    event.preventDefault();

    const apiKey = document.getElementById("apiKey").value;const question = document.getElementById("question").value;
    const game = document.getElementById("gameSelect").value;


    if (apiKey == "" || gameSelect == "" || question == "") {
        button.textContent = `preencha os campos`;
        return;
    }

    // Animação
    console.log("campos preenchidos");
    button.textContent = "Perguntando...";
    button.disabled = true;
    button.classList.add("loading");

    // try - catch - finally

    try{
        const text = await perguntarAI(apiKey, game, question);
        document.getElementById('aiContent').innerHTML = markdownToHTML(text);
    }catch(error){
        console.log("Erro: " + error);
    }finally{
        button.textContent = "Perguntar";
        button.disabled = false;
        button.classList.remove("loading");
    }
}


form.addEventListener("submit", enviarFormulario);

// AIzaSyAK91p2-Tk7cZJEU-2hQSkV7B7OKU3znN4