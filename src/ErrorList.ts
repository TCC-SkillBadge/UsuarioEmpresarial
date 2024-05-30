export class SenhaIncorreta extends Error {
    constructor(){
        super()
        this.name = 'SenhaIncorreta'
        this.message = 'Senha Incorreta'
    }
}
export class ServicoIndisponivel extends Error {
    constructor(){
        super()
        this.name = 'ServicoIndisponivel'
        this.message = 'Serviço Indisponível'
    }
}
export class UsuarioEmpresarialNaoEncontrado extends Error {
    constructor(){
        super()
        this.name = 'UsuarioEmpresarialNaoEncontrado'
        this.message = 'Usuário Empresarial não encontrado'
    }
}
export class NenhumUsuarioEmpresarialEncontrado extends Error {
    constructor(){
        super()
        this.name = 'NenhumUsuarioEmpresarialEncontrado'
        this.message = 'Nenhum Usuário Empresarial encontrado'
    }
}
export class ViolacaoUnique extends Error {
    constructor(path: string){
        switch(path){
            case 'cnpj':
                super()
                this.name = 'CNPJJaCadastrado'
                this.message = 'CNPJ já cadastrado'
                break
            case 'razao_social':
                super()
                this.name = 'RazaoSocialJaCadastrada'
                this.message = 'Razão Social já cadastrada'
                break
            case 'PRIMARY':
                super()
                this.name = 'EmailComercialJaCadastrado'
                this.message = 'Email Comercial já cadastrado'
                break
        }
    }
}