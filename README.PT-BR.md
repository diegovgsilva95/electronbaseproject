Este projeto serve como base para novos projetos que utilizem Electron.

[TOC]

# Recursos
## common/ambient
Permite identificar o ambiente no qual o módulo está atualmente rodando.
### isElectron
Tipo: `function() : boolean`

Retorna:
* `true` caso o módulo esteja executando via **Electron**. 
* `false` caso contrário.

### electron
Tipo: `string` ou `object<Electron>` 

Retorna:
* O **caminho do executável** do **Electron** caso o módulo esteja executando via **Node.js**
* O **módulo Electron** caso o módulo esteja rodando via **Electron**.

## common/loggr
Módulo utilitário que permite a etiquetagem das mensagens impressas via `console`. Permite registrar as mensagens em um arquivo de log.
Em breve, lançarei esse módulo separadamente.

### loggr = new Loggr()
Construtor, não admite parâmetros.
### Level
Objeto nativo que descreve uma etiqueta.
### Level.name 
Tipo: `string`
O nome (apelido) da etiqueta.
### Level.color
Tipo: `string`
A cor que a mensagem receberá sob essa etiqueta (hexadecimal RGB).
Exemplos: #FF0000
### Level.defaultShown
Tipo: `boolean`
Indica se a mensagem será ou não mostrada no terminal.
Se falso, a mensagem será apenas gravada em arquivo, não aparecendo no terminal.
É possível usar valores dinâmicos no lugar das constantes `true` ou `false`, por exemplo:
`!!process.argv.find(arg=>(/info/gi).test(arg))` retornará `true` quando `info` constar na linha de comando.
### loggr.register(Level[, Level[, Level[, ...]]])
Registra uma ou mais etiquetas.
Cada etiqueta criará uma função com o mesmo nome da etiqueta.
Exemplo:
```
loggr.register({
	name: "warn",
	color: "#FF8800",
	defaultShown: true
});
loggr.warn("Electron 1 2 3...");

/* Exemplo de saída: 
[02:59:30] [warn] Electron 1 2 3...
*/
```
### loggr._nome-de-etiqueta_(msg[, msg[, msg[, ...]]])
Registra a mensagem.
### loggr.messages
Tipo: `array`
Array onde as mensagens são registradas
### loggr.filename
Tipo: `string`
Nome do arquivo de log.
### loggr.skipWritingFile
Tipo: `boolean`
Se verdadeiro, as mensagens não são registradas em um arquivo, apenas em terminal.

## common/electron-logger
Módulo utilitário que cria uma nova instância global do `Loggr` e registra alguns tipos de etiquetas.

Etiquetas registradas por padrão:

|  Nome  |    Cor   |      Exibe no terminal?       |
|:------:|:--------:|:-----------------------------:|
|  error | \#cc0000 |              Sim              |
|  info  | \#cccccc | `--info` na linha de comando  |
|  debug | \#888888 | `--debug` na linha de comando |
|   ok   | \#008800 |              Sim              |
|  fail  | \#880000 |              Sim              |
|  lessc | \#886600 | `--debug` na linha de comando |
|   cli  | \#006688 | `--debug` na linha de comando |

### init: function() => Loggr
Instancia um novo `Loggr` e define uma variável global (`global.loggr`) para a instância recém-criada.
Caso uma variável global já existir, retorna a instância previamente criada.

## common/electron-ipc
Módulo utilitário que possibilita a comunicação entre contextos.
Exemplo:
```
//Tanto dentro do contexto do Electron

myIPC = new IPC("Back-end", function(from, ...msg){
	//faz alguma coisa com a msg.
});

//Ou dentro do contexto do browserWindow

myIPC = new IPC("CLI", function(from, ...msg){
	//faz alguma coisa com a msg.
});
```
Tal como o loggr, pretendo lançar esse módulo separadamente, em breve.
### ipc = new IPC(ID: string[, handler: function])
Construtor.
Nos bastidores, utiliza `Electron.ipcRenderer` ou `Electron.ipcMain` para envio e recebimento, dependendo de qual contexto está rodando. O contexto é detectado automaticamente.

### ipc.handler
Tipo: `function(from, ...msgParts)`
Função de callback destinada ao tratamento das mensagens recebidas pelo IPC.

### ipc.send
Tipo: `function(...msg)`
Envia uma mensagem.
* Se enviado via contexto `BrowserWindow`, envia a mensagem para o IPC no contexto do Electron.
* Se enviado via contexto do Electron, envia a mensagem a todos os `BrowserWindow`.

## common/electron-spawn
Se o ambiente for Node.js, é responsável por criar um processo-filho do Electron.

## common/electron-main
Se o ambiente for Electron, ouve pelos erros não manipulados, espera a prontidão (ready) do Electron e inicializa o `electron/index.js`.

## electron/index.js
Seu conteúdo. Neste arquivo, você pode instanciar um ou mais `BrowserWindow`, registrar protocolos, etc...
Quando o conteúdo desse arquivo ser executado, significa que **o Electron está pronto**. 
Portanto, **não use `Electron.app.on("ready", ...)`**.
De fábrica, este arquivo vem com um `BrowserWindow` já instanciado, que carregará o conteúdo de `cli/index.htm`.
## cli/index.htm
Seu conteúdo front-end. A página que será carregada por padrão no `electron/index.js`
Incorpora um script `cli/index.js`.
## cli/index.js
Seu script de front-end. É o código que será rodado no contexto do `BrowserWindow`.
## cli/css/
Suas folhas de estilo. Pode ser tanto CSS quanto LESS ou SASS ou SCSS... Depende de como você programar seu front-end.
## cli/img/
Suas imagens, logotipos, etc.
# Rodando
`node . --color=16m` ou`electron . --color=16m`.

`--color=16m` é opcional: indica ao **Chalk** que o terminal suporta cores 24-bit.

Se iniciado pelo `node`, automaticamente rodará `electron` nos bastidores (vide `common/electron-spawn`).
