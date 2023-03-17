import { css } from '@emotion/react'
import {
  faCircleNotch,
  faPlus,
  faRotateForward,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useCallback, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { sleep } from '../../misc'
import AsyncIconButton from '../../widgets/AsyncIconButton'
import { useArticleStore } from '../store/ArticleStore'

const ListView = () => {
  console.log('render ListView')

  const { articles, hasAlreadyLoaded, loadingError, refresh } =
    useArticleStore()

  useEffect(() => {
    console.log('hasAlreadyLoaded: ', hasAlreadyLoaded)
    if (hasAlreadyLoaded === false) {
      refresh().then(() => {
        console.log('loaded')
      })
    }
  }, [])

  const handleRefresh = useCallback(async () => {
    await refresh()
  }, [])

  const handleRemove = useCallback(async () => {
    await sleep(1000)
  }, [])

  return (
    <main css={s}>
      <h1>Liste des articles</h1>
      <div className="content">
        <nav>
          <AsyncIconButton
            title="Rafraîchir"
            asyncCallback={handleRefresh}
            icon={faRotateForward}
          />
          <Link to="add" className="button" title="Ajouter">
            <FontAwesomeIcon icon={faPlus} />
          </Link>
          <AsyncIconButton
            title="Supprimer"
            asyncCallback={handleRemove}
            icon={faTrashAlt}
          />
        </nav>
        <div className="error">
          {loadingError && 'Erreur lors du chargement'}
        </div>
        <table>
          <thead>
            <tr>
              <th className="name">Nom</th>
              <th className="price">Prix</th>
              <th className="qty">Quantité</th>
            </tr>
          </thead>
          <tbody>
            {hasAlreadyLoaded === false && (
              <tr>
                <td colSpan={3}>
                  <div className="loading">
                    <FontAwesomeIcon icon={faCircleNotch} spin={true} />
                    <span>Chargement...</span>
                  </div>
                </td>
              </tr>
            )}
            {articles.map((a) => (
              <tr key={a.id}>
                <td className="name">{a.name}</td>
                <td className="price">{a.price} €</td>
                <td className="qty">{a.qty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}

export default ListView

const s = css`
  div.content {
    display: flex;
    flex-flow: column;
    gap: 1em;

    nav {
      display: flex;
      gap: 0.3em;
    }
  }

  table {
    .price,
    .qty {
      text-align: right;
    }
  }

  div.loading {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5em;
  }

  div.error {
    height: 1em;
    display: flex;
    align-items: center;
    font-weight: bold;
  }
`
