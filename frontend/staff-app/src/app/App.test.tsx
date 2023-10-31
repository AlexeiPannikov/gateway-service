import { render } from "@testing-library/react"
import { Provider } from "react-redux"
import { store } from "./store"
import Application from "./Application"

test("renders learn react link", () => {
  const { getByText } = render(
    <Provider store={store}>
      <Application />
    </Provider>,
  )

  expect(getByText(/learn/i)).toBeInTheDocument()
})
