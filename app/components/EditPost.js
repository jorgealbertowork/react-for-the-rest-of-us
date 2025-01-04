import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useImmerReducer } from 'use-immer'
import axios from 'axios'

import LoadingDotsIcon from './LoadingDotsIcon'
import Page from './Page'

export const EditPost = () => {
    const originalState = {
        title: { errorMessage: '', hasErrors: false, value: '' },
        body: { errorMessage: '', hasErrors: false, value: '' },
        isFetching: true,
        isSaving: false,
        id: useParams().id,
        sendCount: 0,
    }

    const editPostReducer = (draft, action) => {
        switch (action.type) {
            case 'fetchComplete':
                draft.title.value = action.value.title
                draft.body.value = action.value.body
                draft.isFetching = false
                return
            case 'titleChange':
                draft.title.value = action.value
                return
            case 'bodyChange':
                draft.title.value = action.value
                return
        }
    }

    const [state, dispatch] = useImmerReducer(editPostReducer, originalState)

    useEffect(() => {
        const cancelRequest = axios.CancelToken.source()
        async function fetchPost() {
            try {
                const response = await axios.get(`/post/${state.id}`, {
                    cancelToken: cancelRequest.token,
                })
                if (response.data) {
                    dispatch({ type: 'fetchComplete', value: response.data })
                    console.log(state)
                }
            } catch (e) {
                console.log(
                    'There was a problem, or the request was cancelled.'
                )
            }
        }
        fetchPost()
        return () => {
            cancelRequest.cancel()
        }
    }, [])

    if (state.isFetching)
        return (
            <Page title="...">
                <LoadingDotsIcon />
            </Page>
        )
    console.log(state)
    return (
        <Page title="Edit post">
            <form>
                <div className="form-group">
                    <label htmlFor="post-title" className="text-muted mb-1">
                        <small>Title</small>
                    </label>
                    <input
                        autoComplete="off"
                        autoFocus
                        className="form-control form-control-lg form-control-title"
                        id="post-title"
                        name="title"
                        placeholder=""
                        type="text"
                        value={state.title.value}
                        onChange={(e) =>
                            dispatch({
                                type: 'titleChange',
                                value: e.target.value,
                            })
                        }
                    />
                </div>

                <div className="form-group">
                    <label
                        htmlFor="post-body"
                        className="text-muted mb-1 d-block"
                    >
                        <small>Body Content</small>
                    </label>
                    <textarea
                        className="body-content tall-textarea form-control"
                        id="post-body"
                        name="body"
                        type="text"
                        value={state.body.value}
                        onChange={(e) =>
                            dispatch({
                                type: 'bodyChange',
                                value: e.target.value,
                            })
                        }
                    />
                </div>

                <button className="btn btn-primary">Update Post</button>
            </form>
        </Page>
    )
}

export default EditPost
