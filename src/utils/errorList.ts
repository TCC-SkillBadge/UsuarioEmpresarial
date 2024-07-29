export class SenhaIncorreta extends Error {
    constructor(){
        super();
        this.name = 'SenhaIncorreta';
        this.message = 'Senha Incorreta';
    }
}
export class ServicoIndisponivel extends Error {
    constructor(service: string){
        super();
        this.name = 'ServicoIndisponivel';
        switch(service){
            case 'pesquisaCNPJ':
                this.message = 'Serviço de Pesquisa de CNPJ Indisponível';
                break;
            default:
                this.message = 'Serviço Indisponível';
        }
    }
}
export class UsuarioEmpresarialNaoEncontrado extends Error {
    constructor(){
        super();
        this.name = 'UsuarioEmpresarialNaoEncontrado';
        this.message = 'Usuário Empresarial não encontrado';
    }
}
export class NenhumUsuarioEmpresarialEncontrado extends Error {
    constructor(){
        super();
        this.name = 'NenhumUsuarioEmpresarialEncontrado';
        this.message = 'Nenhum Usuário Empresarial encontrado';
    }
}
export class TokenNaoFornecido extends Error {
    constructor(){
        super();
        this.name = 'TokenNaoFornecido';
        this.message = 'Token não fornecido';
    }
}
export class TokenInvalido extends Error {
    constructor(){
        super();
        this.name = 'TokenInvalido';
        this.message = 'Token Inválido';
    }
}
export class TokenExpirado extends Error {
    constructor(){
        super();
        this.name = 'TokenExpirado';
        this.message = 'Token Expirado';
    }
}
export class ViolacaoUnique extends Error {
    constructor(path: string){
        super();
        switch(path){
            case 'cnpj':
                this.name = 'CNPJJaCadastrado';
                this.message = 'CNPJ já cadastrado';
                break;
            case 'razao_social':
                this.name = 'RazaoSocialJaCadastrada';
                this.message = 'Razão Social já cadastrada';
                break;
            case 'PRIMARY':
                this.name = 'EmailComercialJaCadastrado';
                this.message = 'Email Comercial já cadastrado';
                break;
        }
    }
}
