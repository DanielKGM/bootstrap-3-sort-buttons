function ativaOrdenacao(tabelaID, formularioID) {
  let formulario = $("#" + formularioID);

  // Função para atualizar o conteúdo das tooltips de depuração
  function printLocalStorage() {
    $(".label-default").each(function (index) {
      const icons = ["fa-file-code", "fa-question", "fa-arrows-v", "fa-table"];
      const keys = ["campoSort", "isNumeric", "dirSort", "idTabela"];
      const labels = [
        `Field ref: ${localStorage.getItem(keys[0])}`,
        `isNumber: ${localStorage.getItem(keys[1])}`,
        `Direction: ${localStorage.getItem(keys[2])}`,
        `Table: ${localStorage.getItem(
          keys[3]
        )} (submited)<i class="fa fa-arrow-right"></i> ${formularioID}`,
      ];
      $(this)
        .html(`<i class="fa ${icons[index]}"></i> ${labels[index]}`)
        .tooltip();
    });
  }

  // Função para criar e inserir o overlay dinamicamente
  function criarOverlay() {
    let $tabela = $("#" + tabelaID);
    if ($(`#${tabelaID}Overlay`).length === 0) {
      let overlayHTML = `
					<div id="${tabelaID}Overlay" class="overlay">
						<div class="panel panel-default">
							<div class="panel-body">
								<i class="fa fa-2x fa-pulse fa-spinner"></i>
							</div>
						</div>
					</div>`;
      $tabela.css("position", "relative").append(overlayHTML);
    }
  }
  criarOverlay();

  const fromTo = { desc: null, null: "asc", asc: "desc" };
  const dirIcone = {
    desc: ["fa-sort-alpha-desc", "fa-sort-numeric-desc"],
    null: ["fa-bars", "fa-bars"],
    asc: ["fa-sort-alpha-asc", "fa-sort-numeric-asc"],
  };
  const dirTooltip = {
    desc: "Ordenação Decrescente",
    null: "Clique Para Ordenar",
    asc: "Ordenação Crescente",
  };

  function campoOculto(formulario, id, name, valor) {
    let $input = $("#" + id, formulario);
    if ($input.length === 0) {
      $input = $("<input>")
        .attr({ type: "hidden", id: id, name: name })
        .appendTo(formulario);
    }
    $input.val(valor);
    return valor;
  }

  function atualizarIconeOrdenacao($icone, novaDirecao, indexIcone) {
    const classesDeIcone = `${dirIcone[null][indexIcone]} ${
      dirIcone["asc"][indexIcone]
    } ${dirIcone["desc"][indexIcone]}`;
    $icone
      .removeClass(classesDeIcone)
      .addClass(dirIcone[novaDirecao][indexIcone])
      .data("sortdir", novaDirecao);
  }

  function processaClique(event) {
    event.preventDefault();
    let overlay = $("#" + tabelaID + "Overlay");
    overlay.show(); // Mostrar overlay
    const $th = $(this);
    const $icone = $th.find("i");
    const direcaoAtual = $icone.data("sortdir");
    const novaDirecao = fromTo[direcaoAtual];
    const campoTarget = $th.data("nomecampo");
    const campoOrigin = localStorage.getItem("campoSort");
    const isNumeric = $th.data("isnumeric") || false;
    const indexIcone = isNumeric ? 1 : 0;

    atualizarIconeOrdenacao($icone, novaDirecao, indexIcone);
    $th.attr("data-original-title", dirTooltip[novaDirecao]).tooltip("show");
    $th.toggleClass("th-selecionado", novaDirecao !== null);

    if (
      tabelaID + campoOrigin !==
      localStorage.getItem("idTabela") + campoTarget
    ) {
      const $selecionadoAnterior = $(
        `#${localStorage.getItem(
          "idTabela"
        )} th[data-nomecampo="${campoOrigin}"]`
      );
      atualizarIconeOrdenacao($selecionadoAnterior.find("i"), null, indexIcone);
      $selecionadoAnterior
        .removeClass("th-selecionado")
        .attr("data-original-title", dirTooltip.null);
    }

    localStorage.setItem("idTabela", tabelaID);
    localStorage.setItem(
      "dirSort",
      campoOculto(formulario, "dirSort", "dirSort", novaDirecao)
    );
    localStorage.setItem(
      "campoSort",
      campoOculto(
        formulario,
        "campoSort",
        "campoSort",
        novaDirecao ? campoTarget : null
      )
    );
    localStorage.setItem(
      "isNumeric",
      campoOculto(formulario, "isNumeric", "isNumeric", isNumeric)
    );

    // formulario.submit(); // Descomentar se necessário
    setTimeout(() => {
      overlay.hide(); // Ocultar overlay após a simulação de processamento
    }, 500); // Substitua pelo tempo real de processamento ou callback após conclusão
    printLocalStorage(); // Remover ou comentar para produção
  }

  $(`#${tabelaID} th[data-nomecampo]`).each(function () {
    if (formulario == null) {
      return;
    }
    const $th = $(this);
    const campoTarget = $th.data("nomecampo");
    const isNumeric = $th.data("isnumeric");
    const indexIcone = isNumeric ? 1 : 0;
    const ehSelecionado =
      tabelaID + campoTarget ===
      localStorage.getItem("idTabela") + localStorage.getItem("campoSort");
    const direcaoSort = localStorage.getItem("dirSort");
    const $icone = $('<i class="fa fa-fw icone-ordenacao"></i>')
      .data("sortdir", ehSelecionado ? direcaoSort : null)
      .addClass(
        ehSelecionado
          ? dirIcone[direcaoSort][indexIcone]
          : dirIcone[null][indexIcone]
      );

    $th
      .prepend($icone)
      .addClass("th-ordenacao")
      .toggleClass("th-selecionado", ehSelecionado)
      .on("click", processaClique)
      .attr({
        "data-toggle": "tooltip",
        "data-placement": "top",
        "data-container": "body",
        title: dirTooltip[ehSelecionado ? direcaoSort : null],
      })
      .tooltip();
  });
  printLocalStorage(); // Remover ou comentar para produção
}
