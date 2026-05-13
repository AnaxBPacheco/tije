const UFS = [

    "AC", "AL", "AP", "AM", "BA",
    "CE", "DF", "ES", "GO", "MA",
    "MT", "MS", "MG", "PA", "PB",
    "PR", "PE", "PI", "RJ", "RN",
    "RS", "RO", "RR", "SC", "SP",
    "SE", "TO", "TSE"
];

/*
|--------------------------------------------------------------------------
| Banco
|--------------------------------------------------------------------------
*/

let banco = [];

/*
|--------------------------------------------------------------------------
| Inicialização
|--------------------------------------------------------------------------
*/

inicializar();

async function inicializar() {
    
        try {

            const response =
                await fetch(

                    `data/dados.json?t=${Date.now()}`,

                    {
                        cache: "no-store"
                    }
                );

            banco =
                await response.json();

            renderizar();

        } catch (erro) {

            console.error(
                "Erro ao carregar dados:",
                erro
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Render
        |--------------------------------------------------------------------------
        */

        renderizar();
}

function renderizar() {

    atualizarEstatisticasGerais();

    const analistas =
        gerarResumo("Analista");

    const tecnicos =
        gerarResumo("Técnico");

    renderTabela(
        "tabela-analistas",
        analistas
    );

    renderTabela(
        "tabela-tecnicos",
        tecnicos
    );
}

function gerarResumo(tipoCargo) {

    const filtrados =
        banco.filter(item =>
            item.cargo.includes(tipoCargo)
        );

    const grupos = {};

    filtrados.forEach(item => {

        const uf =
            item.uf.toUpperCase();

        if (!grupos[uf]) {

            grupos[uf] = [];
        }

        grupos[uf].push(item);
    });

    const resumo = [];

    Object.keys(grupos).forEach(uf => {

        const lista = grupos[uf];

        lista.sort((a, b) => {

            const dataA =
                a.data.split("-").join("");

            const dataB =
                b.data.split("-").join("");

            return dataB.localeCompare(dataA);
        });

        const ultima =
            lista[0];

        resumo.push({

            uf: uf,

            data: ultima.data,

            posicao: lista.length
        });
    });

    resumo.sort((a, b) => {

        const dataA =
            a.data.split("-").join("");

        const dataB =
            b.data.split("-").join("");

        return dataB.localeCompare(dataA);
    });

    return resumo;
}

function renderTabela(id, lista) {

    const tabela =
        document.getElementById(id);

    tabela.innerHTML = "";

    lista.forEach((item, index) => {

        tabela.innerHTML += `

            <tr class="bg-white border-b">

                <td class="px-4 py-4">

                    ${lista.length - index}

                </td>

                <td class="px-4 py-4">

                    <a
                        href="uf.html?uf=${item.uf}"
                        class="text-blue-600 hover:underline">

                        ${item.uf}

                    </a>

                </td>

                <td class="px-4 py-4">

                    ${formatarData(item.data)}

                </td>

                <td class="px-4 py-4">

                    ${item.posicao}

                </td>

            </tr>
        `;
    });
}

function formatarData(dataISO) {

    if (!dataISO) {
        return "-";
    }

    const partes =
        dataISO.split("-");

    const ano = partes[0];
    const mes = partes[1];
    const dia = partes[2];

    return `${dia}/${mes}/${ano}`;
}

function atualizarEstatisticasGerais() {

    /*
    |--------------------------------------------------------------------------
    | Total
    |--------------------------------------------------------------------------
    */

    const total =
        banco.length;

    document
        .getElementById("total-nomeados")
        .innerText = total;

    /*
    |--------------------------------------------------------------------------
    | Última nomeação
    |--------------------------------------------------------------------------
    */

    if (total > 0) {

        const ultima =
            banco
                .map(item => item.data)
                .sort()
                .reverse()[0];

        document
            .getElementById("ultima-nomeacao")
            .innerText =
            formatarData(ultima);
    }
}