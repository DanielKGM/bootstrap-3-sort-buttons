function triggerSorting(tableID, formID) {
  let form = $("#" + formID);

  // Função para atualizar o conteúdo das tooltips de depuração
  function printLocalStorage() {
    $(".label-default").each(function (index) {
      const icons = ["fa-file-code", "fa-question", "fa-arrows-v", "fa-table"];
      const keys = ["fieldName", "isNumeric", "dirSort", "tableID"];
      const labels = [
        `Field ref: ${localStorage.getItem(keys[0])}`,
        `isNumber: ${localStorage.getItem(keys[1])}`,
        `Direction: ${localStorage.getItem(keys[2])}`,
        `Table: ${localStorage.getItem(
          keys[3]
        )} (submited)<i class="fa fa-arrow-right"></i> ${formID}`,
      ];
      $(this)
        .html(`<i class="fa ${icons[index]}"></i> ${labels[index]}`)
        .tooltip();
    });
  }

  // Função para criar e inserir o overlay dinamicamente
  function createOverlay() {
    let $table = $("#" + tableID);
    if ($(`#${tableID}Overlay`).length === 0) {
      let overlayHTML = `
					<div id="${tableID}Overlay" class="overlay">
						<div class="panel panel-default">
							<div class="panel-body">
								<i class="fa fa-2x fa-pulse fa-spinner"></i>
							</div>
						</div>
					</div>`;
      $table.css("position", "relative").append(overlayHTML);
    }
  }
  createOverlay();

  const fromTo = { desc: null, null: "asc", asc: "desc" };
  const iconDir = {
    desc: ["fa-sort-alpha-desc", "fa-sort-numeric-desc"],
    null: ["fa-bars", "fa-bars"],
    asc: ["fa-sort-alpha-asc", "fa-sort-numeric-asc"],
  };
  const dirTooltip = {
    desc: "Sort Descending",
    null: "Click to Sort",
    asc: "Sort Ascending",
  };

  function hiddenField(form, id, name, value) {
    let $input = $("#" + id, form);
    if ($input.length === 0) {
      $input = $("<input>")
        .attr({ type: "hidden", id: id, name: name })
        .appendTo(form);
    }
    $input.val(value);
    return value;
  }

  function iconUpdate($icon, newDir, iconIDX) {
    const iconClasses = `${iconDir[null][iconIDX]} ${iconDir["asc"][iconIDX]} ${
      iconDir["desc"][iconIDX]
    }`;
    $icon
      .removeClass(iconClasses)
      .addClass(iconDir[newDir][iconIDX])
      .data("sortdir", newDir);
  }

  function clickCallback(event) {
    event.preventDefault();
    let overlay = $("#" + tableID + "Overlay");
    overlay.show(); // Mostrar overlay
    const $th = $(this);
    const $icon = $th.find("i");
    const currentDir = $icon.data("sortdir");
    const newDir = fromTo[currentDir];
    const targetField = $th.data("fieldname");
    const campoOrigin = localStorage.getItem("fieldName");
    const isNumeric = $th.data("isnumeric") || false;
    const iconIDX = isNumeric ? 1 : 0;

    iconUpdate($icon, newDir, iconIDX);
    $th.attr("data-original-title", dirTooltip[newDir]).tooltip("show");
    $th.toggleClass("th-selecionado", newDir !== null);

    if (
      tableID + campoOrigin !==
      localStorage.getItem("tableID") + targetField
    ) {
      const $selecionadoAnterior = $(
        `#${localStorage.getItem(
          "tableID"
        )} th[data-fieldname="${campoOrigin}"]`
      );
      iconUpdate($selecionadoAnterior.find("i"), null, iconIDX);
      $selecionadoAnterior
        .removeClass("th-selecionado")
        .attr("data-original-title", dirTooltip.null);
    }

    localStorage.setItem("tableID", tableID);
    localStorage.setItem(
      "dirSort",
      hiddenField(form, "dirSort", "dirSort", newDir)
    );
    localStorage.setItem(
      "fieldName",
      hiddenField(form, "fieldName", "fieldName", newDir ? targetField : null)
    );
    localStorage.setItem(
      "isNumeric",
      hiddenField(form, "isNumeric", "isNumeric", isNumeric)
    );

    // form.submit(); // Descomentar se necessário
    setTimeout(() => {
      overlay.hide(); // Ocultar overlay após a simulação de processamento
    }, 500); // Substitua pelo tempo real de processamento ou callback após conclusão
    printLocalStorage(); // Remover ou comentar para produção
  }

  $(`#${tableID} th[data-fieldname]`).each(function () {
    if (form == null) {
      return;
    }
    const $th = $(this);
    const targetField = $th.data("fieldname");
    const isNumeric = $th.data("isnumeric");
    const iconIDX = isNumeric ? 1 : 0;
    const isSelected =
      tableID + targetField ===
      localStorage.getItem("tableID") + localStorage.getItem("fieldName");
    const sortDir = localStorage.getItem("dirSort");
    const $icon = $('<i class="fa fa-fw icone-ordenacao"></i>')
      .data("sortdir", isSelected ? sortDir : null)
      .addClass(
        isSelected ? iconDir[sortDir][iconIDX] : iconDir[null][iconIDX]
      );

    $th
      .prepend($icon)
      .addClass("th-ordenacao")
      .toggleClass("th-selecionado", isSelected)
      .on("click", clickCallback)
      .attr({
        "data-toggle": "tooltip",
        "data-placement": "top",
        "data-container": "body",
        title: dirTooltip[isSelected ? sortDir : null],
      })
      .tooltip();
  });
  printLocalStorage(); // Remover ou comentar para produção
}
