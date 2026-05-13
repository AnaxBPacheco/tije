const params =
    new URLSearchParams(window.location.search);

const uf =
    params.get("uf")?.toUpperCase();

/*
|--------------------------------------------------------------------------
| Inicialização
|--------------------------------------------------------------------------
*/

let banco = [];

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
    }