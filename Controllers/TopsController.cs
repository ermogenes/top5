using System;
using Microsoft.AspNetCore.Mvc;
using top5.db;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using top5.Models;

namespace top5.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TopsController : ControllerBase
    {
        private readonly top5Context _db;

        public TopsController(top5Context contexto)
        {
            _db = contexto;
        }

        // GET api/Tops
        // GET api/Tops?titulo=valorDesejado
        [HttpGet]
        public ActionResult<List<Top>> ObtemTops(string titulo)
        {
            // Obtém todos os tops que contém o título indicado
            // ou todos, se não for indicado nenhum
            var tops = _db.Top
                .Include(top => top.Item) // ver ***
                .Where(top => String.IsNullOrEmpty(titulo) || top.Titulo.Contains(titulo))
                .ToList<Top>();

            // 200 OK
            return Ok(tops);
        }
    
        // GET api/Tops/id-top-desejado
        [HttpGet("{id}")]
        public ActionResult<Top> ObtemTop(string id)
        {
            // Obtém um top que possua o id indicado
            var top = _db.Top
                .Include(top => top.Item) // ver ***
                .SingleOrDefault(top => top.Id == id);

            if (top == null)
            {
                // 404 NOT FOUND
                return NotFound();
            }

            // 200 OK
            return Ok(top);
        }
    
        // POST api/Tops
        // body: objeto do tipo Top
        [HttpPost]
        public ActionResult<Top> IncluiTop(Top topInformado)
        {
            if (topInformado.Id != null)
            {
                // 400 BAD REQUEST
                return BadRequest(new { mensagem = "Id não pode ser informado." });
            }

            // Validação
            var mensagemErro = ValidaTop(topInformado);

            if (!String.IsNullOrEmpty(mensagemErro))
            {
                // 400 BAD REQUEST
                return BadRequest(new { mensagem = mensagemErro });
            }

            // Gera novo identificador único
            topInformado.Id = Guid.NewGuid().ToString();

            // Salva o novo registro
            _db.Add(topInformado);
            _db.SaveChanges();

            // 201 CREATED
            // Location: url do novo registro
            return CreatedAtAction(nameof(ObtemTop), new { id = topInformado.Id }, topInformado);
        }
    
        private string ValidaTop(Top topAValidar)
        {
            if (String.IsNullOrEmpty(topAValidar.Titulo))
            {
                return "Título não informado.";
            }

            if (topAValidar.Curtidas < 0)
            {
                return "Curtidas devem ser positivas.";
            }

            if (topAValidar.Item.Count() != 5)
            {
                return "São esperados exatos 5 itens.";
            }

            int posicaoEsperada = 1;
            foreach(var item in topAValidar.Item.OrderBy(i => i.Posicao))
            {
                if (item.Posicao != posicaoEsperada)
                {
                    return $"Não foi informado item {posicaoEsperada}.";
                }

                if (String.IsNullOrEmpty(item.Nome))
                {
                    return $"Não foi informado o nome do item {item.Posicao}.";
                }

                if (item.Curtidas < 0)
                {
                    return $"Curtidas do item {item.Posicao} devem ser positivas.";
                }

                posicaoEsperada++;
            }

            return "";
        }

        // PUT api/Tops/id-top-desejado
        // body: objeto do tipo Top
        [HttpPut("{id}")]
        public ActionResult<Top> AlteraTop(string id, Top topAlterado)
        {
            if (topAlterado.Id != id)
            {
                // 400 BAD REQUEST
                return BadRequest(new { mensagem = "Id inconsistente." });
            }

            // Obtém um top que possua o id indicado
            var top = _db.Top
                .Include(top => top.Item) // ver ***
                .SingleOrDefault(top => top.Id == id);

            if (top == null)
            {
                // 404 NOT FOUND
                return NotFound();
            }

            // Validação
            var mensagemErro = ValidaTop(topAlterado);

            if (!String.IsNullOrEmpty(mensagemErro))
            {
                // 400 BAD REQUEST
                return BadRequest(new { mensagem = mensagemErro });
            }

            // Altera para os novos valores
            top.Titulo = topAlterado.Titulo;
            for(int posicao = 1; posicao <=5; posicao++)
            {
                string nomeAlterado = topAlterado.Item
                    .SingleOrDefault(i => i.Posicao == posicao)
                    .Nome;
                top.Item
                    .SingleOrDefault(i => i.Posicao == posicao)
                    .Nome = nomeAlterado;
            }
            _db.SaveChanges();

            // 200 OK
            return Ok(top);
        }

        // DELETE api/Tops/id-top-desejado
        [HttpDelete("{id}")]
        public ActionResult ExcluiTop(string id)
        {
            // Obtém um top que possua o id indicado
            var top = _db.Top
                .Include(top => top.Item) // ver ***
                .SingleOrDefault(top => top.Id == id);

            if (top == null)
            {
                // 404 NOT FOUND
                return NotFound();
            }

            // Exclui todos os itens, e depois o top
            top.Item.Clear();
            _db.Remove(top);
            _db.SaveChanges();

            // 200 OK
            return Ok();
        }
    
        // PATCH api/Tops/id-top-desejado/curtir
        [HttpPatch("{id}/curtir")]
        public ActionResult<CurtidasModel> CurteTop(string id)
        {
            // Obtém um top que possua o id indicado
            var top = _db.Top
                .Include(top => top.Item) // ver ***
                .SingleOrDefault(top => top.Id == id);
            
            if (top == null)
            {
                // 400 BAD REQUEST
                return BadRequest();
            }

            // Acrescenta uma curtida
            top.Curtidas += 1;
            _db.SaveChanges();

            // Retorna o novo número de curtidas
            var retorno = new CurtidasModel { Curtidas = top.Curtidas };

            // 200 OK
            return Ok(retorno);
        }

        // PATCH api/Tops/id-top-desejado/Itens/posicao-desejada/curtir
        [HttpPatch("{id}/Itens/{posicao}/curtir")]
        public ActionResult<CurtidasModel> CurteItem(string id, int posicao)
        {
            // Obtém um top que possua o id indicado
            var top = _db.Top
                .Include(top => top.Item) // ver ***
                .SingleOrDefault(top => top.Id == id);
            
            if (top == null)
            {
                // 400 BAD REQUEST
                return BadRequest();
            }

            // Busca pelo item da posição indicada
            var item = top.Item.SingleOrDefault(item => item.Posicao == posicao);

            if (item == null)
            {
                // 400 BAD REQUEST
                return BadRequest();
            }

            // Acrescenta uma curtida ao item
            item.Curtidas += 1;
            _db.SaveChanges();

            // Retorna o novo número de curtidas
            var retorno = new CurtidasModel { Curtidas = item.Curtidas };

            // 200 OK
            return Ok(retorno);
        }
    
    }
}

// *** Para corrigir a referência circular, adicione o pacote
// dotnet add package Microsoft.AspNetCore.Mvc.NewtonsoftJson
// e o referencie nas controllers em ConfigureServices