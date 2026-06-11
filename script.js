let funcionarios = [];

let funcionarioAtual = null;

let abaAtual = "abertura";

let abaHistorico = "positivo";

let chart = null;

/* ==========================
   SALVAR / CARREGAR
========================== */

function salvarDados() {

    localStorage.setItem(
        "coronelStars",
        JSON.stringify(funcionarios)
    );

}

function carregarDados() {

    const dados =
        localStorage.getItem(
            "coronelStars"
        );

    if (dados) {

        funcionarios =
            JSON.parse(dados);

    }

    atualizarTela();

}

carregarDados();

/* ==========================
   ADICIONAR FUNCIONÁRIO
========================== */

document
.getElementById("addFuncionario")
.addEventListener("click", () => {

    const nome =
    document
    .getElementById(
        "novoFuncionario"
    )
    .value
    .trim();

    const horario =
    document
    .getElementById(
        "horarioFuncionario"
    )
    .value;

    if (!nome) {

        alert(
            "Digite o nome do funcionário."
        );

        return;
    }

    funcionarios.push({

    nome,
    horario,

    pontos:0,

    avaliacoes:0,

    positivos:0,

    negativos:0,

    historico:[]
});

    document
    .getElementById(
        "novoFuncionario"
    )
    .value = "";

    salvarDados();

    atualizarTela();

});

/* ==========================
   ABAS HORÁRIOS
========================== */

document
.querySelectorAll(".tab")
.forEach(tab => {

    tab.addEventListener(
        "click",
        () => {

            document
            .querySelectorAll(".tab")
            .forEach(btn => {

                btn.classList.remove(
                    "active"
                );

            });

            tab.classList.add(
                "active"
            );

            abaAtual =
                tab.dataset.tab;

            atualizarTela();

        }
    );

});

/* ==========================
   LISTA FUNCIONÁRIOS
========================== */

function atualizarTela() {

    const lista =
    document.getElementById(
        "funcionarios"
    );

    lista.innerHTML = "";

    const filtrados =
    funcionarios.filter(
        f => f.horario === abaAtual
    );

    filtrados.forEach(funcionario => {

        const index =
        funcionarios.indexOf(
            funcionario
        );

        const porcentagem =
        (funcionario.avaliacoes / 10)
        * 100;

        lista.innerHTML += `

        <div class="funcionario">

            <div class="info">

                <div class="nome">

                    ${funcionario.nome}

                </div>

                <div class="progress">

                    <div
                    class="fill"
                    style="width:${porcentagem}%">

                    </div>

                </div>

                <div class="pontos">

                    ${funcionario.avaliacoes}/10 avaliações

                </div>

            </div>

            <div class="acoes">

                <button
                class="detalhes"
                onclick="abrirModal(${index})">

                    ⭐

                </button>

                <button
                class="remover"
                onclick="removerFuncionario(${index})">

                    🗑

                </button>

            </div>

        </div>

        `;

    });

}

/* ==========================
   REMOVER FUNCIONÁRIO
========================== */

window.removerFuncionario =
function(index) {

    const nome =
    funcionarios[index].nome;

    const confirmar =
    confirm(
        `Remover ${nome}?`
    );

    if (!confirmar)
        return;

    funcionarios.splice(
        index,
        1
    );

    salvarDados();

    atualizarTela();

};

/* ==========================
   ABRIR MODAL
========================== */

window.abrirModal =
function(index) {

    funcionarioAtual =
    index;

    document
    .getElementById(
        "nomeFuncionario"
    )
    .innerText =
    funcionarios[index].nome;

    document
    .getElementById(
        "modal"
    )
    .classList.add(
        "show"
    );

    abaHistorico =
    "positivo";

    document
    .querySelectorAll(
        ".history-tab"
    )
    .forEach(tab => {

        tab.classList.remove(
            "active"
        );

    });

    document
    .querySelector(
        '[data-history="positivo"]'
    )
    .classList.add(
        "active"
    );

    atualizarHistorico();

};

/* ==========================
   FECHAR MODAL
========================== */

document
.getElementById("fechar")
.addEventListener(
    "click",
    () => {

        document
        .getElementById(
            "modal"
        )
        .classList.remove(
            "show"
        );

    }
);

/* ==========================
   SALVAR FEEDBACK
========================== */

document
.getElementById("salvar")
.addEventListener(
    "click",
    () => {

        if (
            funcionarioAtual === null
        ) return;

        const funcionario =
        funcionarios[
            funcionarioAtual
        ];

        if (
            funcionario.avaliacoes >= 10
        ) {

            alert(
                "Este funcionário já atingiu o limite de avaliações."
            );

            return;

        }

        const tipo =
        document
        .getElementById(
            "tipo"
        )
        .value;

        const descricao =
        document
        .getElementById(
            "descricao"
        )
        .value
        .trim();

        const avaliador =
        document
        .getElementById(
            "avaliador"
        )
        .value
        .trim();

        if (
            !descricao ||
            !avaliador
        ) {

            alert(
                "Preencha todos os campos."
            );

            return;

        }

        funcionario.avaliacoes++;

       if (
    tipo === "positivo"
) {

    funcionario.pontos += 1;

    funcionario.positivos++;

} else {

    funcionario.pontos -= 0.5;

    funcionario.negativos++;

}

        funcionario.historico.push({

            tipo,

            descricao,

            avaliador,

            data:
            new Date()
            .toLocaleString()

        });

        document
        .getElementById(
            "descricao"
        )
        .value = "";

        document
        .getElementById(
            "avaliador"
        )
        .value = "";

        salvarDados();

        atualizarTela();

        atualizarHistorico();

        alert(
            "Avaliação salva!"
        );

    }
);

/* ==========================
   HISTÓRICO
========================== */

function atualizarHistorico() {

    if (
        funcionarioAtual === null
    ) return;

    const funcionario =
    funcionarios[
        funcionarioAtual
    ];

    const lista =
    document.getElementById(
        "historicoLista"
    );

    lista.innerHTML = "";

    const historicoFiltrado =

    funcionario.historico

    .filter(item =>

        item.tipo ===
        abaHistorico

    )

    .reverse();

    if (
        historicoFiltrado.length === 0
    ) {

        lista.innerHTML =

        `
        <p>
            Nenhum feedback encontrado.
        </p>
        `;

        return;
    }

    historicoFiltrado.forEach(
        item => {

            lista.innerHTML +=

            `
            <div class="feedback-item ${item.tipo}">

                <strong>

                    ${item.avaliador}

                </strong>

                <p>

                    ${item.descricao}

                </p>

                <small>

                    ${item.data}

                </small>

            </div>
            `;

        }
    );

}

/* ==========================
   ABAS HISTÓRICO
========================== */

document
.querySelectorAll(
    ".history-tab"
)
.forEach(tab => {

    tab.addEventListener(
        "click",
        () => {

            document
            .querySelectorAll(
                ".history-tab"
            )
            .forEach(btn => {

                btn.classList.remove(
                    "active"
                );

            });

            tab.classList.add(
                "active"
            );

            abaHistorico =
            tab.dataset.history;

            atualizarHistorico();

        }
    );

});

/* ==========================
   CALCULAR MÊS
========================== */

document
.getElementById(
    "calcularMes"
)
.addEventListener(
    "click",
    () => {

        atualizarRanking();

    }
);

/* ==========================
   RANKING
========================== */

function atualizarRanking() {

    const ranking =

    [...funcionarios]

    .sort(
        (a,b)=>
        b.pontos - a.pontos
    )

    .slice(0,5);

    if (
        ranking.length === 0
    ) {

        alert(
            "Não existem funcionários cadastrados."
        );

        return;

    }

    document
    .getElementById(
        "funcMes"
    )
    .innerText =
    ranking[0].nome;

    document
    .getElementById(
        "pontosMes"
    )
    .innerText =
    `${ranking[0].avaliacoes} avaliações`;

    atualizarGrafico(
        ranking
    );

}

/* ==========================
   GRÁFICO
========================== */

function atualizarGrafico(
    ranking
) {

    const ctx =
    document
    .getElementById(
        "grafico"
    );

    const labels =
    ranking.map(
        f => f.nome
    );

    const dados =
    ranking.map(
        f => f.pontos
    );

    if (chart) {

        chart.destroy();

    }

    chart =
    new Chart(ctx, {

        type: "bar",

        data: {

            labels,

            datasets: [

                {

                    label: "Pontuação",

                    data: dados,

                    backgroundColor:
                    "#e4002b"

                }

            ]

        },

        options: {

            responsive:true,

            maintainAspectRatio:false,

            plugins:{

                legend:{
                    display:false
                }

            }

        }

    });

}

/* ==========================
   RESETAR MÊS
========================== */

document
.getElementById(
    "resetarMes"
)
.addEventListener(
    "click",
    () => {

        const confirmar =
        confirm(
            "Deseja resetar o mês?"
        );

        if (!confirmar)
            return;

funcionarios.forEach(
    funcionario => {

        funcionario.pontos = 0;

        funcionario.avaliacoes = 0;

        funcionario.positivos = 0;

        funcionario.negativos = 0;

        funcionario.historico = [];

    }
);

        if (chart) {

            chart.destroy();

            chart = null;

        }

        document
        .getElementById(
            "funcMes"
        )
        .innerText =
        "Nenhum";

        document
        .getElementById(
            "pontosMes"
        )
        .innerText =
        "Aguardando cálculo";

        salvarDados();

        atualizarTela();

    }
);

/* ==========================
   PDF (FUTURO)
========================== */


function criarCabecalho(pdf, titulo){

    pdf.setFillColor(228,0,43);

    pdf.rect(
        0,
        0,
        210,
        30,
        "F"
    );

    pdf.setTextColor(
        255,
        255,
        255
    );

    pdf.setFontSize(22);

    pdf.text(
        "CORONEL STARS",
        15,
        15
    );

    pdf.setFontSize(10);

    pdf.text(
        titulo,
        15,
        23
    );

    pdf.setFillColor(
        255,
        255,
        255
    );

    pdf.rect(
        180,
        5,
        4,
        18,
        "F"
    );

    pdf.rect(
        188,
        5,
        4,
        18,
        "F"
    );

    pdf.rect(
        196,
        5,
        4,
        18,
        "F"
    );

    pdf.setTextColor(
        0,
        0,
        0
    );

    pdf.setDrawColor(
        228,
        0,
        43
    );

    pdf.line(
        10,
        35,
        200,
        35
    );
}

document
.getElementById("pdfBtn")
.addEventListener("click",()=>{

    const ranking =
    [...funcionarios]
    .sort((a,b)=>b.pontos-a.pontos);

    if(ranking.length===0){

        alert("Não existem funcionários.");

        return;
    }

    const vencedor = ranking[0];

    const positivos =
    funcionarios.reduce(
        (s,f)=>s+(f.positivos||0),
        0
    );

    const negativos =
    funcionarios.reduce(
        (s,f)=>s+(f.negativos||0),
        0
    );

    const totalAvaliacoes =
    positivos + negativos;

    const taxaAprovacao =
    totalAvaliacoes > 0
    ?
    (
        (positivos/totalAvaliacoes)
        *100
    ).toFixed(1)
    :
    0;

    const { jsPDF } =
    window.jspdf;

    const pdf =
    new jsPDF();

    criarCabecalho(
        pdf,
        "Relatorio Executivo"
    );

    let y = 40;

    // CARD CAMPEÃO

    pdf.setDrawColor(228,0,43);

    pdf.roundedRect(
        15,
        y,
        180,
        35,
        3,
        3
    );

    pdf.setFontSize(16);

    pdf.text(
        "FUNCIONARIO DO MES",
        20,
        y+10
    );

    pdf.setFontSize(12);

    pdf.text(
        vencedor.nome,
        20,
        y+20
    );

    pdf.text(
        `${vencedor.pontos} pontos`,
        20,
        y+28
    );

    y += 50;

    // INDICADORES

    pdf.setFontSize(15);

    pdf.text(
        "INDICADORES DA EQUIPE",
        15,
        y
    );

    y += 12;

    pdf.text(
        `Feedbacks Positivos: ${positivos}`,
        20,
        y
    );

    y += 8;

    pdf.text(
        `Feedbacks Negativos: ${negativos}`,
        20,
        y
    );

    y += 8;

    pdf.text(
        `Taxa de Aprovacao: ${taxaAprovacao}%`,
        20,
        y
    );

    y += 20;

    // RANKING

    pdf.setFontSize(15);

    pdf.text(
        "RANKING GERAL",
        15,
        y
    );

    y += 10;

    ranking.forEach((f,index)=>{

       let medalha = "";

if(index===0) medalha="1º Lugar";
if(index===1) medalha="2º Lugar";
if(index===2) medalha="3º Lugar";
if(index>2) medalha=`${index+1}º Lugar`;

       pdf.text(
    `${medalha} - ${f.nome} (${f.pontos} pts)`,
    20,
    y
);

        y += 8;

    });

    y += 15;

    pdf.line(
        15,
        y,
        195,
        y
    );

    y += 15;

    pdf.text(
        "Gerente Geral:",
        15,
        y
    );

    pdf.line(
        55,
        y,
        180,
        y
    );

    y += 20;

    pdf.text(
        "Treinador:",
        15,
        y
    );

    pdf.line(
        45,
        y,
        180,
        y
    );

    pdf.setFontSize(8);

    pdf.text(
    `Gerado em ${new Date().toLocaleString()}`,
    15,
    275
);

    pdf.save(
        "Relatorio_Executivo.pdf"
    );

});

document
.getElementById("pdfIndividual")
.addEventListener("click",()=>{

    if(funcionarioAtual===null)
    return;

    const funcionario =
    funcionarios[funcionarioAtual];

    const { jsPDF } =
    window.jspdf;

    const pdf =
    new jsPDF();

    criarCabecalho(
        pdf,
        "Ficha Individual"
    );

    let y = 40;

    pdf.setFontSize(18);

    pdf.text(
        funcionario.nome,
        15,
        y
    );

    y += 15;

pdf.setFillColor(228,0,43);

pdf.roundedRect(
    15,
    y,
    180,
    12,
    2,
    2,
    "F"
);

pdf.setTextColor(255,255,255);

pdf.setFontSize(14);

pdf.text(
    "FUNCIONARIO DO MES",
    20,
    y+8
);

pdf.setTextColor(0,0,0);

pdf.roundedRect(
    15,
    y,
    180,
    35,
    2,
    2
);

    pdf.text(
        `Pontos: ${funcionario.pontos}`,
        20,
        y+18
    );

    pdf.text(
        `Positivos: ${funcionario.positivos}`,
        100,
        y+10
    );

    pdf.text(
        `Negativos: ${funcionario.negativos}`,
        100,
        y+18
    );

    pdf.text(
        `Avaliacoes: ${funcionario.avaliacoes}/10`,
        20,
        y+26
    );

    y += 50;

    pdf.setFontSize(14);

    pdf.text(
        "HISTORICO DE FEEDBACKS",
        15,
        y
    );

    y += 10;

    funcionario.historico.forEach(item=>{

        if(y > 260){

            pdf.addPage();

            criarCabecalho(
                pdf,
                "Continuação"
            );

            y = 40;
        }

        const cor =
        item.tipo==="positivo"
        ?
        [0,150,0]
        :
        [228,0,43];

        pdf.setTextColor(...cor);

        pdf.text(
            item.tipo==="positivo"
            ? "✓ POSITIVO"
            : "✗ NEGATIVO",
            20,
            y
        );

        pdf.setTextColor(0,0,0);

        y += 7;

        const texto = pdf.splitTextToSize(
            item.descricao,
            150
        );

        pdf.text(
            texto,
            25,
            y
        );

        y += texto.length*6;

        pdf.text(
            `Avaliador: ${item.avaliador}`,
            25,
            y
        );

        y += 6;

        pdf.text(
            `Data: ${item.data}`,
            25,
            y
        );

        y += 12;

    });

    pdf.save(
        `${funcionario.nome}.pdf`
    );

});