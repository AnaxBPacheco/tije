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

function renderizarPagina(lista, uf) {

    /*
    |--------------------------------------------------------------------------
    | Tribunal
    |--------------------------------------------------------------------------
    */

    const titulo =
        uf === "TSE"
            ? "TSE - Sede"
            : `TRE/${uf}`;

    document
        .getElementById("titulo-tribunal")
        .innerText = titulo;

    /*
    |--------------------------------------------------------------------------
    | Última data
    |--------------------------------------------------------------------------
    */

    if (lista.length > 0) {

        const ultima =
            lista
            .map(item => item.data)
            .sort()
            .reverse()[0];

        document
            .getElementById("ultima-data")
            .innerText = formatarData(ultima);
    }

    /*
    |--------------------------------------------------------------------------
    | Analistas
    |--------------------------------------------------------------------------
    */

    const analistas =
        lista.filter(item =>
            item.cargo.includes("Analista")
        );

    /*
    |--------------------------------------------------------------------------
    | Técnicos
    |--------------------------------------------------------------------------
    */

    const tecnicos =
        lista.filter(item =>
            item.cargo.includes("Técnico")
        );

    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    renderTabela(
        "tabela-analistas",
        analistas
    );

    renderTabela(
        "tabela-tecnicos",
        tecnicos
    );
}

/*
|--------------------------------------------------------------------------
| Render tabela
|--------------------------------------------------------------------------
*/

function renderTabela(id, lista) {

    const tabela =
        document.getElementById(id);

    tabela.innerHTML = "";

    lista.forEach((item, index) => {

        const bg =
            index % 2 === 0
                ? "bg-white-200"
                : "bg-gray-200";

        tabela.innerHTML += `
            <tr class="${bg} border-b">

                <th
                    scope="row"
                    class="px-3 py-4 font-medium text-gray-900">

                    ${index + 1}

                </th>

                <td class="px-3 py-4">

                    ${item.nome}

                </td>

                <td class="px-6 py-4">

                    ${formatarData(item.data)}

                </td>

                <td class="px-6 py-4">

                    <a
                        href="${item.link}"
                        target="_blank"
                        class="font-medium text-blue-600 hover:underline">

                        ${item.ato}

                    </a>

                </td>

            </tr>
        `;
    });
}