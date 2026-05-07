const params =
    new URLSearchParams(window.location.search);

const uf =
    params.get("uf")?.toUpperCase();

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
        | Filtra UF
        |--------------------------------------------------------------------------
        */

        const filtrados =
            banco.filter(item =>
                item.uf.toUpperCase() === uf
            );

        /*
        |--------------------------------------------------------------------------
        | Ordena por data
        |--------------------------------------------------------------------------
        */

        filtrados.sort((a, b) => {

            const dataA =
                a.data.split("-").join("");

            const dataB =
                b.data.split("-").join("");

            return dataA.localeCompare(dataB);
        });

        /*
        |--------------------------------------------------------------------------
        | Render
        |--------------------------------------------------------------------------
        */

        renderizarPagina(
            filtrados,
            uf
        );
    });