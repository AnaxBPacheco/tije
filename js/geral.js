const UFS = [

    "AC","AL","AP","AM","BA",
    "CE","DF","ES","GO","MA",
    "MT","MS","MG","PA","PB",
    "PR","PE","PI","RJ","RN",
    "RS","RO","RR","SC","SP",
    "SE","TO","TSE"
];

/*
|--------------------------------------------------------------------------
| Cache
|--------------------------------------------------------------------------
*/

let banco =
    JSON.parse(
        localStorage.getItem("banco_cache")
    ) || [];

/*
|--------------------------------------------------------------------------
| Manifest
|--------------------------------------------------------------------------
*/

fetch("data/manifest.json")

.then(response => response.json())

.then(async manifest => {

    let arquivosLidos =
        JSON.parse(
            localStorage.getItem("arquivos_lidos")
        ) || [];

    for (const arquivo of manifest.arquivos) {

        if (arquivosLidos.includes(arquivo)) {
            continue;
        }

        try {

            const response =
                await fetch(`data/${arquivo}`);

            const dados =
                await response.json();

            banco.push(...dados);

            arquivosLidos.push(arquivo);

        } catch (erro) {

            console.error(
                `Erro ao carregar ${arquivo}`,
                erro
            );
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Salva cache
    |--------------------------------------------------------------------------
    */

    localStorage.setItem(
        "banco_cache",
        JSON.stringify(banco)
    );

    localStorage.setItem(
        "arquivos_lidos",
        JSON.stringify(arquivosLidos)
    );

    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    renderizar();
});

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

        lista.sort((a, b) =>
            new Date(b.data) - new Date(a.data)
        );

        const ultima =
            lista[0];

        resumo.push({

            uf: uf,

            data: ultima.data,

            posicao: lista.length
        });
    });

    resumo.sort((a, b) =>
        new Date(b.data) - new Date(a.data)
    );

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