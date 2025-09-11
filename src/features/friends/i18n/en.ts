const en = {
  friends: {
    errors: {
      defaultError: 'Something went wrong. Please try again.',
      userAlreadyExists: 'This account already exists.',
      userNotFound: 'User not found.',
      alreadyFriend: 'This user is already your friend.',
      requestAlreadySent: 'Friend request already sent.',
      cantAddYourself: 'You cannot add yourself as a friend.',
    },
    title: 'Contacts',
    friendsList: {
      title: 'Your Friends',
      search: {
        label: 'Search',
        placeholder: 'Type a name or email...',
      },
      empty: 'You have no friends yet. Start connecting with others!',
      actions: {
        addFriend: {
          button: 'Add new friend',
          title: 'Add Friend',
          backBtn: 'Close',
          form: {
            label: 'Email',
            placeholder: 'Enter the email address',
            btnLabel: 'Send Request',
            errors: {
              email: {
                required: 'Email is required.',
                invalid: 'Invalid email format.',
              },
            },
          },
          feedback: {
            success: 'Friend request sent successfully!',
          },
        },
        removeFriend: {
          button: 'Remove',
          label: 'Remove Friend',
          title: 'Remove Friend',
          confirm: {
            message: 'Are you sure you want to remove <bold>${name}</bold> from your friends?',
            yes: 'Yes, remove',
            no: 'No, keep',
          },
          feedback: {
            success: 'Friend removed successfully!',
          },
        },
        viewProfile: {
          button: 'View Profile',
        },
        startChat: {
          button: 'Start Chat',
        },
        realtime: {
          friendRequestReceived: '${name} sent you a friend request',
          friendRequestAccepted: '${name} accepted your friend request',
          friendRequestCancelled: '${name} declined your friend request',
        },
      },
    },
    friendsRequestList: {
      title: 'Friend Requests',
      noRequests: 'No friend requests yet. Incoming requests will appear here.',
      error: 'Unable to load friend requests.',
      actions: {
        sendFriendRequest: {
          button: 'Add new friend',
          title: 'Add Friend',
          backBtn: 'Close',
          form: {
            label: 'Email',
            placeholder: 'Enter the email address',
            btnLabel: 'Send Request',
            errors: {
              email: {
                required: 'Email is required.',
                invalid: 'Invalid email format.',
              },
            },
          },
          feedback: {
            success: 'Friend request sent successfully!',
          },
        },
        acceptFriendRequest: {
          button: 'Accept',
          title: 'Accept Friend Request',
          confirm: {
            message: 'Are you sure you want to accept <bold>${name}</bold> as a friend?',
            yes: 'Yes, accept',
            no: 'No, decline',
          },
          feedback: {
            success: 'Friend request accepted successfully!',
          },
        },
        cancelFriendRequest: {
          button: 'Decline',
          title: 'Decline Friend Request',
          confirm: {
            message: 'Are you sure you want to decline <bold>${name}</bold> friend request?',
            yes: 'Yes, decline',
            no: 'No, keep',
          },
          feedback: {
            success: 'Friend request declined successfully!',
          },
        },
      },
    },
  },
} as const;

export default en;
