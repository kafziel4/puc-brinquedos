const ajax = new XMLHttpRequest();

ajax.open('GET', './dados.json', true);

ajax.send();

ajax.onreadystatechange = function () {
  const content = document.getElementById('content');

  if (this.readyState == 4 && this.status == 200) {
    const jsonData = JSON.parse(ajax.responseText);

    if (jsonData.length == 0) {
      content.innerHTML = `<div class="alert alert-warning" role="alert">
        Desculpe. Ainda não temos brinquedos cadastrados!
      </div>`;
    } else {
      let htmlContent = '';

      for (let i = 0; i < jsonData.length; i++) {
        htmlContent += `<div class="row">
          <div class="col-12">
            <h2><span></span>${jsonData[i].categoria}</h2>
          </div>
        </div>`;

        if (jsonData[i].brinquedos.length == 0) {
          htmlContent += `<div class="row">
            <div class="col-12">
              <div class="alert alert-warning" role="alert">
                Desculpe. Não temos brinquedos para esta categoria.
              </div>
            </div>
          </div>`;
        } else {
          htmlContent += `<div class="row">`;

          for (let j = 0; j < jsonData[i].brinquedos.length; j++) {
            htmlContent += cardBrinquedo(jsonData[i].brinquedos[j]);
          }

          htmlContent += `</div>`;
        }
      }

      content.innerHTML = htmlContent;
      cacheDinamico(jsonData);
    }
  }
};

const cardBrinquedo = (brinquedo) => {
  return `<div class="col-lg-6">
    <div class="card">
      <img src="${brinquedo.imagem}" class="card-img-top" alt="${brinquedo.nome}">
      <div class="card-body">
        <h5 class="card-title">${brinquedo.nome}</h5>
        <p class="card-text"><strong>Valor:</strong> ${brinquedo.valor}</p>
        <div class="d-grid gap-2">
          <a href="https://api.whatsapp.com/send?phone=55${brinquedo.whatsapp}&text=Olá, gostaria de informações sobre o brinquedo: ${brinquedo.nome}" target="_blank" class="btn btn-info">Contato Proprietário</a>
        </div>
      </div>
    </div>
  </div>`;
};

const cacheDinamico = (jsonData) => {
  if ('caches' in window) {
    console.log('Deletando cache dinâmico antigo');

    const files = [];

    caches.delete('brinquedo-app-dinamico').then(() => {
      if (jsonData.length > 0) {
        files.push('dados.json');

        for (let i = 0; i < jsonData.length; i++) {
          for (let j = 0; j < jsonData[i].brinquedos.length; j++) {
            if (files.indexOf(jsonData[i].brinquedos[j].imagem) == -1) {
              files.push(jsonData[i].brinquedos[j].imagem);
            }
          }
        }
      }

      caches.open('brinquedo-app-dinamico').then((cache) => {
        cache.addAll(files).then(() => {
          console.log('Novo cache dinâmico adicionado!');
        });
      });
    });
  }
};

let disparoInstalacao = null;
const btnInstall = document.getElementById('btnInstall');

const inicializarInstalacao = () => {
  btnInstall.removeAttribute('hidden');
  btnInstall.addEventListener('click', () => {
    disparoInstalacao.prompt();
    disparoInstalacao.userChoice.then((choice) => {
      if (choice.outcome === 'accepted') {
        console.log('Usuário realizou a instação');
      } else {
        console.log('Usuário NÃO realizou a instação');
      }
    });
  });
};

window.addEventListener('beforeinstallprompt', gravarDisparo);

function gravarDisparo(evt) {
  disparoInstalacao = evt;
}
