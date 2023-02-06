import { useEffect, useRef, useState } from 'react';
import { v4 as uuid } from 'uuid';

import { MEMBERS } from './member-data';

import { Loader } from '../svg/loader.jsx';

import './household.scss';

const MEMBERS_URL = 'https://63d006cc8a780ae6e681fea9.mockapi.io/api/members'

export const Household = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [members, setMembers] = useState(MEMBERS);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const getMembers = async () => {
      const res = await fetch(MEMBERS_URL);

      const newMembers = await res.json();
      setMembers(newMembers);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    };
    getMembers();
  }, []);

  const addMember = (newMember) => {
    console.log('new member args', newMember)
    const submitNewMember = async () => {
      const res = await fetch(MEMBERS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newMember)
      })
      const newMemberData = await res.json()
      console.log({ newMemberData })
    }
    submitNewMember()
    setMembers((prv) => [...prv, newMember]);
  };

  const removeMember = (id) => {
    setMembers((prv) => prv.filter((mbr) => mbr.id !== id));
  };

  return (
    <>
      <section className="household">
        <h1 className="household__header">Your household</h1>
        <p className="household__subheader">
          Welcome to the marketplace! Review your household below:
        </p>
        <div className="member-list">
          {loading ? (
            <div className="loader-wrapper">
              <Loader />
            </div>
          ) : (
            <>
              {members.map((member) => (
                <Member
                  key={member.id}
                  {...member}
                  removeMember={() => removeMember(member.id)}
                />
              ))}
            </>
          )}
        </div>
        <button onClick={() => setModalOpen(true)} className="submit">
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
  );
};

function Member({ firstName, lastName, description, favoriteFruit }) {
  return (
    <article className="member">
      <button
        className="member__remove-btn"
        aria-label="close add member dialog"
        // onClick={() => removeMember()}
      >
        &times;
      </button>
      <h2 className="member__name">
        {firstName} {lastName}
      </h2>
      <p className="member__detail">
        <span>Description:</span>
        <span>{description}</span>
      </p>
      <p className="member__detail">
        <span>Favorite fruit:</span>
        <span>{favoriteFruit}</span>
      </p>
    </article>
  );
}

function AddMemberModal({ closeModal, addMember }) {
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const descRef = useRef(null);
  const fruitRef = useRef(null);

  const handleSubmit = (e) => {
    console.log('submit clicked');
    e.preventDefault();
    addMember({
      firstName: firstNameRef.current.value,
      lastName: lastNameRef.current.value,
      description: descRef.current.value,
      favoriteFruit: fruitRef.current.value,
    });
    closeModal();
  };

  return (
    <div className="shade">
      <article className="modal">
        <button
          className="modal__close-btn"
          aria-label="close add member dialog"
          onClick={closeModal}
        >
          <span>Close</span> &times;
        </button>
        <form className="modal__form" onSubmit={handleSubmit}>
          <h4 className="modal__header">Add a new household member.</h4>
          {[
            { label: 'First name:', ref: firstNameRef },
            { label: 'Last name:', ref: lastNameRef },
            { label: 'Description:', ref: descRef },
            { label: 'Favorite fruit:', ref: fruitRef },
          ].map((inp) => {
            return (
              <label key={inp.label}>
                {inp.label}
                <input type="text" ref={inp.ref} required />
              </label>
            );
          })}
          <button className="modal__submit-btn submit" type="submit">
            Add member
          </button>
        </form>
      </article>
    </div>
  );
}
