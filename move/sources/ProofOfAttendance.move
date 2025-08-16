module MyModule::ProofOfAttendance {
    use aptos_framework::signer;
    use std::vector;
    use std::string::{Self, String};
    use aptos_framework::timestamp;

    /// Error codes
    const E_EVENT_NOT_FOUND: u64 = 1;
    const E_ALREADY_ATTENDED: u64 = 2;
    const E_INVALID_EVENT_NAME: u64 = 3;

    /// Struct representing an event with attendance tracking.
    struct Event has store, key {
        name: String,               // Event name
        attendees: vector<address>, // List of attendee addresses
        attendance_count: u64,      // Total number of attendees
        created_at: u64,           // Timestamp when event was created
    }

    /// Global registry to track all events
    struct EventRegistry has key {
        events: vector<address>,    // List of event organizer addresses
    }

    /// Initialize the event registry (call once after deployment)
    public entry fun initialize(admin: &signer) {
        let registry = EventRegistry {
            events: vector::empty<address>(),
        };
        move_to(admin, registry);
    }

    /// Function to create a new event with a given name.
    public entry fun create_event(organizer: &signer, event_name: vector<u8>) acquires EventRegistry {
        // Validate event name is not empty
        assert!(!vector::is_empty(&event_name), E_INVALID_EVENT_NAME);
        
        let organizer_addr = signer::address_of(organizer);
        let event_name_string = string::utf8(event_name);
        
        let event = Event {
            name: event_name_string,
            attendees: vector::empty<address>(),
            attendance_count: 0,
            created_at: timestamp::now_seconds(),
        };
        
        move_to(organizer, event);
        
        // Add to global registry if it exists
        if (exists<EventRegistry>(@MyModule)) {
            let registry = borrow_global_mut<EventRegistry>(@MyModule);
            if (!vector::contains(&registry.events, &organizer_addr)) {
                vector::push_back(&mut registry.events, organizer_addr);
            }
        }
    }

    /// Function for users to claim attendance at an event.
    public entry fun claim_attendance(attendee: &signer, event_organizer: address) acquires Event {
        // Check if event exists
        assert!(exists<Event>(event_organizer), E_EVENT_NOT_FOUND);
        
        let event = borrow_global_mut<Event>(event_organizer);
        let attendee_addr = signer::address_of(attendee);
        
        // Check if already attended to prevent double claiming
        assert!(!vector::contains(&event.attendees, &attendee_addr), E_ALREADY_ATTENDED);
        
        vector::push_back(&mut event.attendees, attendee_addr);
        event.attendance_count = event.attendance_count + 1;
    }

    // View function to get event details
    #[view]
    public fun get_event(event_organizer: address): (String, u64, u64) acquires Event {
        assert!(exists<Event>(event_organizer), E_EVENT_NOT_FOUND);
        let event = borrow_global<Event>(event_organizer);
        (event.name, event.attendance_count, event.created_at)
    }

    // View function to check if user attended an event
    #[view]
    public fun has_attended(attendee: address, event_organizer: address): bool acquires Event {
        if (!exists<Event>(event_organizer)) {
            return false
        };
        let event = borrow_global<Event>(event_organizer);
        vector::contains(&event.attendees, &attendee)
    }

    // View function to get all events
    #[view]
    public fun get_all_events(): vector<address> acquires EventRegistry {
        if (!exists<EventRegistry>(@MyModule)) {
            return vector::empty<address>()
        };
        let registry = borrow_global<EventRegistry>(@MyModule);
        registry.events
    }
}