import { useRef, useState } from 'react'
import { v4 as uuid } from 'uuid'

import { MEMBERS } from './member-data'

import './household.scss'

export const Household = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const [members, setMembers] = useState(MEMBERS)
 
  const addMember = (newMember) => {
    setMembers((prv) => [...prv, newMember])
  }
 
  const removeMember = (id) => {
    setMembers((prv) => prv.filter((mbr) => mbr.id !== id))
  }

  return (
    <>
      <section className='household'>
        <h1 className='household__header'>Your household</h1>
        <p className='household__subheader'>
          Welcome to the marketplace! Review your household below:
        </p>
        <div className='member-list'>
          {members.map((member) => (
            <Member
              key={member.id}
              {...member}
              removeMember={() => removeMember(member.id)}
            />
          ))}
        </div>
        <button onClick={() => setModalOpen(true)} className='submit'>
          Add a new member
        </button>
      </section>
      {modalOpen && (
        <AddMemberModal
          closeModal={() => setModalOpen(false)}
          addMember={addMember}
        />
      )}
    </>
  )
}

function Member({ id, name, desc, fruit, removeMember }) {
  return (
    <article className='member'>
      <button
        className='member__remove-btn'
        aria-label='close add member dialog'
        onClick={() => removeMember(id)}
      >
        &times;
      </button>
      <h2 className='member__name'>{name}</h2>
      <p className='member__detail'>
        <span>Description:</span>
        <span>{desc}</span>
      </p>
      <p className='member__detail'>
        <span>Favorite fruit:</span>
        <span>{fruit}</span>
      </p>
    </article>
  )
}

function AddMemberModal({ closeModal, addMember }) {
  const nameRef = useRef(null)
  const descRef = useRef(null)
  const fruitRef = useRef(null)

  const handleSubmit = (e) => {
    console.log('submit clicked')
    e.preventDefault()
    addMember({
      id: uuid(),
      name: nameRef.current.value,
      desc: descRef.current.value,
      fruit: fruitRef.current.value,
    })
    closeModal()
  }

  return (
    <div className='shade'>
      <article className='modal'>
        <button
          className='modal__close-btn'
          aria-label='close add member dialog '
          onClick={closeModal}
        >
          <span>Close</span> &times;
        </button>
        <form className='modal__form' onSubmit={handleSubmit}>
          <h4 className='modal__header'>Add a new household member.</h4>
          {[
            { label: 'Full name:', ref: nameRef },
            { label: 'Description:', ref: descRef },
            { label: 'Favorite fruit:', ref: fruitRef },
          ].map((inp) => {
            return (
              <label>
                {inp.label}
                <input type='text' ref={inp.ref} />
              </label>
            )
          })}
          <button className='modal__submit-btn submit' type='submit'>
            Add member
          </button>
        </form>
      </article>
    </div>
  )
}
