import { createUniqueId, ParentProps } from 'solid-js'

export interface XFormExpose {
  form: HTMLFormElement
  reset: () => void
  validate: () => boolean
}

export interface XFormItemProps extends ParentProps, UIProps<string> {
  label: string
  required?: boolean
  validator?: () => string | undefined
}

export interface XFormItemValidation {
  reset: () => void
  validate: () => boolean
}

export interface XFormProps
  extends ExposeProps<XFormExpose>,
    ParentProps,
    UIProps<string> {
  disabled?: boolean
  inline?: boolean
  labelWidth?: string
}

export const XFormContext =
  createContext<
    Readonly<{
      disabled: boolean
      inline: boolean
      labelWidth: string
      validations: XFormItemValidation[]
    }>
  >()
export function XForm(props: XFormProps) {
  const _props = mergeProps(
    { disabled: false, inline: false, labelWidth: '100px' } as const,
    props,
  )

  let fe: HTMLFormElement

  const validations = [] as XFormItemValidation[]

  const validate = () => validations.every((it) => it.validate())
  const reset = () => {
    validations.forEach((it) => {
      it.reset()
    })
  }

  const value = {
    get disabled() {
      return _props.disabled
    },
    get inline() {
      return _props.inline
    },
    get labelWidth() {
      return _props.labelWidth
    },
    get validations() {
      return validations
    },
  }

  _props.expose?.({
    get form() {
      return fe
    },
    reset,
    validate,
  })

  return (
    <XFormContext.Provider value={value}>
      <form class={_props.ui} ref={(el) => (fe = el)}>
        {_props.children}
      </form>
    </XFormContext.Provider>
  )
}

export const XFormItemContext =
  createContext<
    Readonly<{
      disabled: boolean
      error?: string
      id: string
      validation?: XFormItemValidation
    }>
  >()
export function XFormItem(props: XFormItemProps) {
  const _props = mergeProps({ required: false } as const, props)

  const context = useContext(XFormContext)

  const [error, setError] = createSignal<string | undefined>()

  const validation = {
    reset: () => {
      setError()
    },
    validate: () => {
      setError(_props.validator?.())
      return !error()
    },
  }
  context?.validations.push(validation)
  onCleanup(() => {
    context?.validations.splice(context.validations.indexOf(validation), 1)
  })

  const id = createUniqueId()

  const value = {
    get disabled() {
      return context?.disabled ?? false
    },
    get error() {
      return error()
    },
    id,
    get validation() {
      return validation
    },
  }

  return (
    <XFormItemContext.Provider value={value}>
      <div
        class={cx(
          'grid-cols-[auto_1fr] items-start gap-x-2',
          context?.inline ? 'inline-grid' : 'grid',
          _props.ui,
        )}>
        <label
          class='text-right'
          for={id}
          style={{ width: context?.labelWidth }}>
          <Show when={_props.required}>
            <span class='mr-1 text-red-500'>*</span>
          </Show>
          {_props.label}
        </label>
        <div class='overflow-hidden'>{_props.children}</div>
        <div class='col-start-2'>
          <div
            class={cx(
              'h-4 text-xs text-red-500',
              error() ? 'visible' : 'invisible',
            )}>
            {error()}
          </div>
        </div>
      </div>
    </XFormItemContext.Provider>
  )
}
