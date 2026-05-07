const ESTADOS = {

    AC: "ACRE",
    AL: "ALAGOAS",
    AP: "AMAPÁ",
    AM: "AMAZONAS",
    BA: "BAHIA",
    CE: "CEARÁ",
    DF: "DISTRITO FEDERAL",
    ES: "ESPÍRITO SANTO",
    GO: "GOIÁS",
    MA: "MARANHÃO",
    MG: "MINAS GERAIS",
    MS: "MATO GROSSO DO SUL",
    MT: "MATO GROSSO",
    PA: "PARÁ",
    PB: "PARAÍBA",
    PE: "PERNAMBUCO",
    PI: "PIAUÍ",
    PR: "PARANÁ",
    RJ: "RIO DE JANEIRO",
    RN: "RIO GRANDE DO NORTE",
    RO: "RONDÔNIA",
    RR: "RORAIMA",
    RS: "RIO GRANDE DO SUL",
    SC: "SANTA CATARINA",
    SE: "SERGIPE",
    SP: "SÃO PAULO",
    TO: "TOCANTINS",
    TSE: "TSE - SEDE"
};

/*
|--------------------------------------------------------------------------
| Banco
|--------------------------------------------------------------------------
*/

let banco = [];

/*
|--------------------------------------------------------------------------
| Manifest
|--------------------------------------------------------------------------
*/

fetch("data/manifest.json")

    .then(response => response.json())

    .then(async manifest => {

        for (const arquivo of manifest.arquivos) {

            try {

                const response =
                    await fetch(
                        `data/${arquivo}?v=${Date.now()}`
                    );

                const dados =
                    await response.json();

                banco.push(...dados);

            } catch (erro) {

                console.error(
                    `Erro ao carregar ${arquivo}`,
                    erro
                );
            }
        }

        renderizar();
    });

/*
|--------------------------------------------------------------------------
| Data
|--------------------------------------------------------------------------
*/

function formatarData(dataISO) {

    if (!dataISO) {
        return "-";
    }

    const partes =
        dataISO.split("-");

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

/*
|--------------------------------------------------------------------------
| Estatísticas
|--------------------------------------------------------------------------
*/

function contar(uf, cargo) {

    return banco.filter(item =>

        item.uf.toUpperCase() === uf
        &&

        item.cargo
            .toUpperCase()
            .includes(cargo)

    ).length;
}

/*
|--------------------------------------------------------------------------
| Última nomeação
|--------------------------------------------------------------------------
*/

function obterUltimaNomeacao() {

    if (banco.length === 0) {
        return "-";
    }

    const ultima =
        banco
            .sort((a, b) =>
                new Date(b.data)
                - new Date(a.data)
            )[0];

    return `${ultima.uf.toUpperCase()}(${formatarData(ultima.data)})`;
}

/*
|--------------------------------------------------------------------------
| Render
|--------------------------------------------------------------------------
*/

function renderizar() {

    /*
    |--------------------------------------------------------------------------
    | Hero
    |--------------------------------------------------------------------------
    */

    document
        .getElementById("ultima-nomeacao")
        .innerText =
        obterUltimaNomeacao();

    /*
    |--------------------------------------------------------------------------
    | Totais gerais
    |--------------------------------------------------------------------------
    */

    const totalAnalistas =
        banco.filter(item =>

            item.cargo
                .toUpperCase()
                .includes("ANALISTA")

        ).length;

    const totalTecnicos =
        banco.filter(item =>

            item.cargo
                .toUpperCase()
                .includes("TÉCNICO")

        ).length;

    /*
    |--------------------------------------------------------------------------
    | Grid
    |--------------------------------------------------------------------------
    */

    const grid =
        document.getElementById(
            "grid-estados"
        );

    /*
    |--------------------------------------------------------------------------
    | Quadro Geral
    |--------------------------------------------------------------------------
    */

    grid.innerHTML += `

        <a
            href="geral.html"
            class="block p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100 transition-colors">

            <h3
                class="mb-2 text-xl font-bold tracking-tight text-gray-900">

                QUADRO GERAL

            </h3>

            <p class="text-sm text-gray-500">

                Analista (
                    ${totalAnalistas}
                )

                |

                Técnico (
                    ${totalTecnicos}
                )

            </p>

        </a>
    `;

    /*
    |--------------------------------------------------------------------------
    | Estados
    |--------------------------------------------------------------------------
    */

    const estadosOrdenados =

        Object.keys(ESTADOS)

            .map(uf => {

                const analistas =
                    contar(uf, "ANALISTA");

                const tecnicos =
                    contar(uf, "TÉCNICO");

                return {

                    uf,

                    nome: ESTADOS[uf],

                    analistas,

                    tecnicos,

                    total:
                        analistas + tecnicos
                };
            })

            /*
            |--------------------------------------------------------------------------
            | Primeiro quem tem dados
            |--------------------------------------------------------------------------
            */

            .sort((a, b) => {

                /*
                |--------------------------------------------------------------------------
                | Com dados primeiro
                |--------------------------------------------------------------------------
                */

                if (a.total > 0 && b.total === 0) {
                    return -1;
                }

                if (a.total === 0 && b.total > 0) {
                    return 1;
                }

                /*
                |--------------------------------------------------------------------------
                | Mais nomeações primeiro
                |--------------------------------------------------------------------------
                */

                return b.total - a.total;
            });

    /*
    |--------------------------------------------------------------------------
    | Render cards
    |--------------------------------------------------------------------------
    */

    estadosOrdenados.forEach(item => {

        const desabilitado =
            item.total === 0;

        const href =
            desabilitado
                ? "#"
                : `uf.html?uf=${item.uf}`;

        /*
        |--------------------------------------------------------------------------
        | Classes
        |--------------------------------------------------------------------------
        */

        const classeCard =
            desabilitado

                ? `
                    bg-gray-100
                    border-gray-200
                    opacity-60
                    pointer-events-none
                `

                : `
                    bg-white
                    border-gray-200
                    hover:bg-gray-100
                `;

        const estiloTitulo =
            desabilitado
                ? 'style="color:#9CA3AF"'
                : '';

        /*
        |--------------------------------------------------------------------------
        | Texto
        |--------------------------------------------------------------------------
        */

        const descricao = `
            Analista (${item.analistas})
            |
            Técnico (${item.tecnicos})
        `;

        /*
        |--------------------------------------------------------------------------
        | Card
        |--------------------------------------------------------------------------
        */

        grid.innerHTML += `

            <a
                href="${href}"
                class="
                    ${classeCard}
                    block
                    p-6
                    rounded-lg
                    border
                    shadow-md
                    transition-colors
                ">

                <h3
                    ${estiloTitulo}
                    class="
                        mb-2
                        text-xl
                        font-bold
                        tracking-tight
                    ">

                    ${item.nome}

                </h3>

                <p class="text-sm text-gray-500">

                    ${descricao}

                </p>

            </a>
        `;
    });
}